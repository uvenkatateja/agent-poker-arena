import { GameState, PlayerAction, cardToString } from './poker-engine';

export interface AIResponse {
    action: PlayerAction;
    amount: number;
    reason: string;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openrouter/free';

const PLAYER_PROMPTS: Record<string, string> = {
    aggressive: `You are "Maverick", an aggressive and bold poker AI player.
Your playing style:
- You love to RAISE and apply pressure on opponents
- You bluff frequently with weak hands 
- You prefer big pots and high-risk plays
- You rarely fold — you'd rather go down swinging
- You are confident, cocky, and love trash talk in your reasoning
- You see weakness in opponents who check or call too much`,

    defensive: `You are "Guardian", a conservative and calculated poker AI player.
Your playing style:
- You prefer to CALL and FOLD weak hands to minimize losses
- You only raise with strong hands
- You are patient and wait for premium hands to strike
- You value chip preservation above all else
- You are calm, analytical, and logical in your reasoning
- You look for patterns and exploit over-aggressive opponents`,
};

function buildGamePrompt(style: string, gameState: GameState, playerIndex: number): string {
    const player = gameState.players[playerIndex];
    const opponent = gameState.players[1 - playerIndex];
    const communityStr = gameState.communityCards.map(cardToString).join(', ') || 'None yet';
    const handStr = player.hand.map(cardToString).join(', ');

    const recentMoves = gameState.moves.slice(-6).map(m =>
        `  ${m.player}: ${m.action}${m.amount > 0 ? ` $${m.amount}` : ''} — ${m.reason}`
    ).join('\n');

    const allowedActions: string[] = [];
    if (gameState.currentBet === player.currentBet) allowedActions.push('check');
    if (gameState.currentBet > player.currentBet && player.chips > 0) {
        allowedActions.push(`call (costs $${gameState.currentBet - player.currentBet})`);
    }
    if (player.chips > gameState.currentBet) {
        allowedActions.push(`raise (min $${gameState.currentBet + gameState.bigBlind}, max $${player.chips + player.currentBet})`);
    }
    allowedActions.push('fold');
    if (player.chips > 0) allowedActions.push(`all-in ($${player.chips})`);

    return `=== CURRENT GAME STATE ===
Phase: ${gameState.phase}
Your Hand: ${handStr}
Community Cards: ${communityStr}
Pot: $${gameState.pot}
Your Chips: $${player.chips}
Your Current Bet: $${player.currentBet}
Opponent Chips: $${opponent.chips}
Opponent Current Bet: $${opponent.currentBet}
Current Bet to Match: $${gameState.currentBet}

Recent Moves:
${recentMoves || '  No moves yet'}

=== ALLOWED ACTIONS ===
${allowedActions.join('\n')}

=== INSTRUCTIONS ===
Respond ONLY with valid JSON (no markdown, no code blocks, no extra text). Choose one of these actions: fold, call, check, raise, all-in.
If you raise, specify the TOTAL bet amount (not additional amount).
The amount should be 0 for fold/check/call, and for raise specify total bet amount.

JSON format:
{"action": "fold|call|check|raise|all-in", "amount": 0, "reason": "brief explanation"}`;
}

function parseAIResponse(text: string): AIResponse {
    try {
        const jsonMatch = text.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const validActions: PlayerAction[] = ['fold', 'call', 'check', 'raise', 'all-in'];
            if (validActions.includes(parsed.action)) {
                return {
                    action: parsed.action as PlayerAction,
                    amount: typeof parsed.amount === 'number' ? parsed.amount : 0,
                    reason: parsed.reason || 'No reason given',
                };
            }
        }
    } catch {
        // Parse failed
    }
    return { action: 'fold', amount: 0, reason: 'Failed to parse AI response — defaulting to fold' };
}

function validateMove(response: AIResponse, gameState: GameState, playerIndex: number): AIResponse {
    const player = gameState.players[playerIndex];
    if (response.action === 'check' && gameState.currentBet > player.currentBet) {
        return { action: 'call', amount: 0, reason: response.reason + ' (corrected: must call)' };
    }
    if (response.action === 'call' && gameState.currentBet === player.currentBet) {
        return { action: 'check', amount: 0, reason: response.reason + ' (corrected: checking)' };
    }
    if (response.action === 'raise') {
        const minRaise = gameState.currentBet + gameState.bigBlind;
        const maxRaise = player.chips + player.currentBet;
        if (response.amount < minRaise) response.amount = minRaise;
        if (response.amount > maxRaise) {
            response.action = 'all-in';
            response.amount = player.chips;
        }
    }
    return response;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getAIMove(gameState: GameState, playerIndex: number): Promise<AIResponse> {
    const player = gameState.players[playerIndex];
    const systemPrompt = PLAYER_PROMPTS[player.style] || PLAYER_PROMPTS.aggressive;
    const userPrompt = buildGamePrompt(player.style, gameState, playerIndex);

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
        console.error('VITE_OPENROUTER_API_KEY not set');
        return fallbackMove(gameState, playerIndex);
    }

    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            console.log(`[${player.name}] Calling AI (attempt ${attempt + 1})...`);

            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'AI Poker Arena',
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt },
                    ],
                    temperature: 0.7,
                    max_tokens: 200,
                }),
            });

            if (response.status === 429) {
                console.log(`[${player.name}] Rate limited, waiting...`);
                await sleep((attempt + 1) * 2000);
                continue;
            }

            if (!response.ok) {
                const errText = await response.text();
                console.error(`[${player.name}] API error:`, response.status, errText);
                break;
            }

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                const text = data.choices[0].message?.content || '';
                const modelUsed = data.model || 'unknown';
                console.log(`[${player.name}] Got response via ${modelUsed}:`, text.substring(0, 150));
                const parsed = parseAIResponse(text);
                return validateMove(parsed, gameState, playerIndex);
            }
            break;
        } catch (error) {
            console.error(`[${player.name}] Fetch error:`, error);
            if (attempt < 2) await sleep((attempt + 1) * 1000);
        }
    }

    return fallbackMove(gameState, playerIndex);
}

function fallbackMove(gameState: GameState, playerIndex: number): AIResponse {
    const player = gameState.players[playerIndex];
    if (gameState.currentBet === player.currentBet) {
        return { action: 'check', amount: 0, reason: 'API unavailable — checking' };
    }
    return { action: 'call', amount: 0, reason: 'API unavailable — calling' };
}
