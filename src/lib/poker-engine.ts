// ===== TYPES =====
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
    suit: Suit;
    rank: Rank;
}

export type PlayerAction = 'fold' | 'call' | 'raise' | 'check' | 'all-in';

export interface PlayerMove {
    player: string;
    action: PlayerAction;
    amount: number;
    reason: string;
    timestamp: number;
}

export interface Player {
    id: string;
    name: string;
    avatar: string;
    style: string;
    model: string;
    chips: number;
    hand: Card[];
    currentBet: number;
    folded: boolean;
    isAllIn: boolean;
}

export type GamePhase = 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown' | 'finished';

export interface GameState {
    id: string;
    phase: GamePhase;
    pot: number;
    communityCards: Card[];
    players: Player[];
    currentPlayerIndex: number;
    currentBet: number;
    moves: PlayerMove[];
    round: number;
    winner: string | null;
    winReason: string | null;
    smallBlind: number;
    bigBlind: number;
}

export interface LeaderboardEntry {
    name: string;
    avatar: string;
    model: string;
    style: string;
    wins: number;
    losses: number;
    totalPoints: number;
    handsPlayed: number;
    biggestPot: number;
    winRate: number;
    chips: number;
}

// ===== CARD HELPERS =====
const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const SUIT_SYMBOLS: Record<Suit, string> = {
    hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠'
};

const RANK_VALUES: Record<Rank, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

export function cardToString(card: Card): string {
    return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}

export function cardToDisplay(card: Card): string {
    return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}

// ===== DECK =====
function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ suit, rank });
        }
    }
    return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ===== HAND EVALUATION =====
interface HandRank {
    rank: number;
    name: string;
    highCards: number[];
}

function getCombinations(cards: Card[], k: number): Card[][] {
    if (k === 0) return [[]];
    if (cards.length === 0) return [];
    const result: Card[][] = [];
    const [first, ...rest] = cards;
    for (const combo of getCombinations(rest, k - 1)) {
        result.push([first, ...combo]);
    }
    for (const combo of getCombinations(rest, k)) {
        result.push(combo);
    }
    return result;
}

function checkStraight(values: number[]): boolean {
    const sorted = [...values].sort((a, b) => b - a);
    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i] - sorted[i + 1] !== 1) {
            if (sorted[0] === 14 && sorted[1] === 5 && sorted[2] === 4 && sorted[3] === 3 && sorted[4] === 2) return true;
            return false;
        }
    }
    return true;
}

function evaluateFiveCards(cards: Card[]): HandRank {
    const values = cards.map(c => RANK_VALUES[c.rank]).sort((a, b) => b - a);
    const suits = cards.map(c => c.suit);
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = checkStraight(values);
    const counts = new Map<number, number>();
    for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
    const groups = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || b[0] - a[0]);

    if (isFlush && isStraight && values[0] === 14) return { rank: 9, name: 'Royal Flush', highCards: values };
    if (isFlush && isStraight) return { rank: 8, name: 'Straight Flush', highCards: values };
    if (groups[0][1] === 4) return { rank: 7, name: 'Four of a Kind', highCards: [groups[0][0], groups[1][0]] };
    if (groups[0][1] === 3 && groups[1][1] === 2) return { rank: 6, name: 'Full House', highCards: [groups[0][0], groups[1][0]] };
    if (isFlush) return { rank: 5, name: 'Flush', highCards: values };
    if (isStraight) return { rank: 4, name: 'Straight', highCards: values };
    if (groups[0][1] === 3) return { rank: 3, name: 'Three of a Kind', highCards: [groups[0][0], ...groups.slice(1).map(g => g[0])] };
    if (groups[0][1] === 2 && groups[1][1] === 2) return { rank: 2, name: 'Two Pair', highCards: [groups[0][0], groups[1][0], groups[2][0]] };
    if (groups[0][1] === 2) return { rank: 1, name: 'One Pair', highCards: [groups[0][0], ...groups.slice(1).map(g => g[0])] };
    return { rank: 0, name: 'High Card', highCards: values };
}

function compareHighCards(a: number[], b: number[]): number {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
}

function getHandRank(cards: Card[]): HandRank {
    const allCombinations = getCombinations(cards, 5);
    let bestHand: HandRank = { rank: -1, name: '', highCards: [] };
    for (const combo of allCombinations) {
        const hand = evaluateFiveCards(combo);
        if (hand.rank > bestHand.rank || (hand.rank === bestHand.rank && compareHighCards(hand.highCards, bestHand.highCards) > 0)) {
            bestHand = hand;
        }
    }
    return bestHand;
}

// ===== GAME ENGINE =====
let deck: Card[] = [];
let deckIndex = 0;

function dealCard(): Card {
    return deck[deckIndex++];
}

export function createNewGame(round: number = 1): GameState {
    deck = shuffleDeck(createDeck());
    deckIndex = 0;

    const player1: Player = {
        id: 'player1',
        name: 'Maverick',
        avatar: '🔥',
        style: 'aggressive',
        model: 'OpenRouter Free',
        chips: 1000,
        hand: [dealCard(), dealCard()],
        currentBet: 0,
        folded: false,
        isAllIn: false,
    };

    const player2: Player = {
        id: 'player2',
        name: 'Guardian',
        avatar: '🛡️',
        style: 'defensive',
        model: 'OpenRouter Free',
        chips: 1000,
        hand: [dealCard(), dealCard()],
        currentBet: 0,
        folded: false,
        isAllIn: false,
    };

    const smallBlind = 10;
    const bigBlind = 20;
    player1.chips -= smallBlind;
    player1.currentBet = smallBlind;
    player2.chips -= bigBlind;
    player2.currentBet = bigBlind;

    return {
        id: `game_${Date.now()}`,
        phase: 'pre-flop',
        pot: smallBlind + bigBlind,
        communityCards: [],
        players: [player1, player2],
        currentPlayerIndex: 0,
        currentBet: bigBlind,
        moves: [
            { player: player1.name, action: 'call', amount: smallBlind, reason: 'Small blind posted', timestamp: Date.now() },
            { player: player2.name, action: 'raise', amount: bigBlind, reason: 'Big blind posted', timestamp: Date.now() },
        ],
        round,
        winner: null,
        winReason: null,
        smallBlind,
        bigBlind,
    };
}

export function applyMove(gameState: GameState, move: PlayerMove): GameState {
    const state = JSON.parse(JSON.stringify(gameState)) as GameState;
    // Re-create deck state for dealing
    if (state.phase !== 'finished') {
        deck = shuffleDeck(createDeck()); // Note: not ideal but for community cards we store them
    }

    const playerIndex = state.players.findIndex(p => p.name === move.player);
    const player = state.players[playerIndex];

    switch (move.action) {
        case 'fold':
            player.folded = true;
            const otherPlayer = state.players.find(p => !p.folded);
            if (otherPlayer) {
                state.winner = otherPlayer.name;
                state.winReason = `${move.player} folded`;
                otherPlayer.chips += state.pot;
                state.phase = 'finished';
            }
            break;
        case 'check':
            break;
        case 'call': {
            const callAmount = Math.min(state.currentBet - player.currentBet, player.chips);
            player.chips -= callAmount;
            player.currentBet += callAmount;
            state.pot += callAmount;
            if (player.chips === 0) player.isAllIn = true;
            break;
        }
        case 'raise': {
            const raiseTotal = Math.min(move.amount, player.chips + player.currentBet);
            const additionalBet = raiseTotal - player.currentBet;
            if (additionalBet > 0) {
                player.chips -= additionalBet;
                player.currentBet = raiseTotal;
                state.pot += additionalBet;
                state.currentBet = raiseTotal;
            }
            if (player.chips === 0) player.isAllIn = true;
            break;
        }
        case 'all-in': {
            const allInAmount = player.chips;
            state.pot += allInAmount;
            player.currentBet += allInAmount;
            player.chips = 0;
            player.isAllIn = true;
            if (player.currentBet > state.currentBet) state.currentBet = player.currentBet;
            break;
        }
    }

    move.timestamp = Date.now();
    state.moves.push(move);
    state.currentPlayerIndex = (playerIndex + 1) % state.players.length;

    if (state.phase !== 'finished' && shouldAdvancePhase(state)) {
        advancePhase(state);
    }

    return state;
}

function shouldAdvancePhase(state: GameState): boolean {
    const activePlayers = state.players.filter(p => !p.folded);
    if (activePlayers.length <= 1) return true;
    const betsEqual = activePlayers.every(p => p.currentBet === state.currentBet || p.isAllIn);
    const blindMoves = 2;
    const movesInPhase = state.moves.length - blindMoves;

    if (state.phase === 'pre-flop') {
        return betsEqual && movesInPhase >= 1 && state.moves[state.moves.length - 1].action !== 'raise';
    }
    const phaseMoves = getMovesInCurrentPhase(state);
    return betsEqual && phaseMoves >= 2;
}

function getMovesInCurrentPhase(state: GameState): number {
    let count = 0;
    for (let i = state.moves.length - 1; i >= 0; i--) {
        const move = state.moves[i];
        if (move.reason.includes('blind')) break;
        if (move.reason === 'Phase advanced') break;
        count++;
    }
    return count;
}

// Separate deck for community cards  
let communityDeck: Card[] = [];
let communityDeckIndex = 0;

export function initCommunityDeck(gameState: GameState): void {
    // Create a deck excluding player hands
    const usedCards = new Set(
        gameState.players.flatMap(p => p.hand.map(c => `${c.rank}_${c.suit}`))
    );
    communityDeck = shuffleDeck(
        createDeck().filter(c => !usedCards.has(`${c.rank}_${c.suit}`))
    );
    communityDeckIndex = 0;
}

function dealCommunityCard(): Card {
    return communityDeck[communityDeckIndex++];
}

function advancePhase(state: GameState): void {
    for (const player of state.players) player.currentBet = 0;
    state.currentBet = 0;
    state.currentPlayerIndex = 0;

    switch (state.phase) {
        case 'pre-flop':
            state.phase = 'flop';
            // If community deck not initialized, do it now
            if (communityDeckIndex === 0 && communityDeck.length === 0) initCommunityDeck(state);
            state.communityCards.push(dealCommunityCard(), dealCommunityCard(), dealCommunityCard());
            break;
        case 'flop':
            state.phase = 'turn';
            state.communityCards.push(dealCommunityCard());
            break;
        case 'turn':
            state.phase = 'river';
            state.communityCards.push(dealCommunityCard());
            break;
        case 'river':
            state.phase = 'showdown';
            resolveShowdown(state);
            break;
    }

    state.moves.push({
        player: 'System',
        action: 'check',
        amount: 0,
        reason: `Phase advanced`,
        timestamp: Date.now(),
    });
}

function resolveShowdown(state: GameState): void {
    const activePlayers = state.players.filter(p => !p.folded);
    if (activePlayers.length === 1) {
        state.winner = activePlayers[0].name;
        state.winReason = 'Last player standing';
        activePlayers[0].chips += state.pot;
        state.phase = 'finished';
        return;
    }

    let bestPlayer: Player | null = null;
    let bestHand: HandRank | null = null;
    let bestHandName = '';

    for (const player of activePlayers) {
        const allCards = [...player.hand, ...state.communityCards];
        const hand = getHandRank(allCards);
        if (!bestHand || hand.rank > bestHand.rank ||
            (hand.rank === bestHand.rank && compareHighCards(hand.highCards, bestHand.highCards) > 0)) {
            bestHand = hand;
            bestPlayer = player;
            bestHandName = hand.name;
        }
    }

    if (bestPlayer) {
        state.winner = bestPlayer.name;
        state.winReason = `Won with ${bestHandName}`;
        bestPlayer.chips += state.pot;
        state.phase = 'finished';
    }
}

export function isGameOver(state: GameState): boolean {
    return state.phase === 'finished' || state.phase === 'showdown';
}
