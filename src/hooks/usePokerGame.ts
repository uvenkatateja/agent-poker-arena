import { useState, useCallback, useRef, useEffect } from 'react';
import {
    GameState,
    LeaderboardEntry,
    createNewGame,
    applyMove,
    isGameOver,
    initCommunityDeck,
} from '@/lib/poker-engine';
import { getAIMove } from '@/lib/ai-service';

interface UsePokerGameReturn {
    gameState: GameState | null;
    leaderboard: LeaderboardEntry[];
    loading: boolean;
    autoPlay: boolean;
    stats: {
        totalGames: number;
        activeAgents: number;
        totalPot: number;
    };
    startGame: () => void;
    nextMove: () => Promise<void>;
    toggleAutoPlay: () => void;
    resetLeaderboard: () => void;
}

// Persistent leaderboard across hook instances
const storedLeaderboard = new Map<string, LeaderboardEntry>();

function initLeaderboardPlayer(name: string, avatar: string, model: string, style: string): LeaderboardEntry {
    return {
        name, avatar, model, style,
        wins: 0, losses: 0, totalPoints: 0,
        handsPlayed: 0, biggestPot: 0, winRate: 0, chips: 1000,
    };
}

function getLeaderboard(): LeaderboardEntry[] {
    if (!storedLeaderboard.has('Maverick')) {
        storedLeaderboard.set('Maverick', initLeaderboardPlayer('Maverick', '🔥', 'OpenRouter Free', 'aggressive'));
    }
    if (!storedLeaderboard.has('Guardian')) {
        storedLeaderboard.set('Guardian', initLeaderboardPlayer('Guardian', '🛡️', 'OpenRouter Free', 'defensive'));
    }
    return Array.from(storedLeaderboard.values()).sort((a, b) => b.totalPoints - a.totalPoints);
}

function updateLeaderboard(winnerName: string, loserName: string, pot: number) {
    const lb = getLeaderboard(); // Ensures entries exist
    const winner = storedLeaderboard.get(winnerName)!;
    const loser = storedLeaderboard.get(loserName)!;

    winner.wins += 1;
    winner.totalPoints += 10;
    winner.handsPlayed += 1;
    winner.biggestPot = Math.max(winner.biggestPot, pot);
    winner.chips += pot / 2;
    winner.winRate = winner.handsPlayed > 0 ? Math.round((winner.wins / winner.handsPlayed) * 1000) / 10 : 0;

    loser.losses += 1;
    loser.handsPlayed += 1;
    loser.biggestPot = Math.max(loser.biggestPot, pot);
    loser.winRate = loser.handsPlayed > 0 ? Math.round((loser.wins / loser.handsPlayed) * 1000) / 10 : 0;
}

export function usePokerGame(): UsePokerGameReturn {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(getLeaderboard());
    const [loading, setLoading] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const autoPlayRef = useRef(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const refreshLeaderboard = useCallback(() => {
        setLeaderboard([...getLeaderboard()]);
    }, []);

    const startGame = useCallback(() => {
        const totalGames = getLeaderboard().reduce((sum, p) => sum + p.handsPlayed, 0) / 2;
        const newGame = createNewGame(Math.floor(totalGames) + 1);
        initCommunityDeck(newGame);
        setGameState(newGame);
        refreshLeaderboard();
    }, [refreshLeaderboard]);

    const nextMove = useCallback(async () => {
        if (loading || !gameState || isGameOver(gameState)) return;
        setLoading(true);

        try {
            const currentPlayerIndex = gameState.currentPlayerIndex;
            const currentPlayer = gameState.players[currentPlayerIndex];

            const aiResponse = await getAIMove(gameState, currentPlayerIndex);

            const newState = applyMove(gameState, {
                player: currentPlayer.name,
                action: aiResponse.action,
                amount: aiResponse.amount,
                reason: aiResponse.reason,
                timestamp: Date.now(),
            });

            setGameState(newState);

            if (isGameOver(newState) && newState.winner) {
                const loser = newState.players.find(p => p.name !== newState.winner);
                if (loser) {
                    updateLeaderboard(newState.winner, loser.name, newState.pot);
                    refreshLeaderboard();
                }
            }
        } catch (err) {
            console.error('Error getting AI move:', err);
        } finally {
            setLoading(false);
        }
    }, [gameState, loading, refreshLeaderboard]);

    // Auto-play logic
    useEffect(() => {
        autoPlayRef.current = autoPlay;
    }, [autoPlay]);

    useEffect(() => {
        if (autoPlay && gameState && !isGameOver(gameState) && !loading) {
            timeoutRef.current = setTimeout(async () => {
                if (autoPlayRef.current) {
                    await nextMove();
                }
            }, 1500);
        }

        if (autoPlay && gameState && isGameOver(gameState) && !loading) {
            timeoutRef.current = setTimeout(() => {
                if (autoPlayRef.current) {
                    startGame();
                }
            }, 3000);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [autoPlay, gameState, loading, nextMove, startGame]);

    const toggleAutoPlay = useCallback(() => {
        setAutoPlay(prev => !prev);
    }, []);

    const resetLeaderboard = useCallback(() => {
        storedLeaderboard.clear();
        refreshLeaderboard();
    }, [refreshLeaderboard]);

    // Initialize on mount
    useEffect(() => {
        startGame();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const totalGames = leaderboard.reduce((sum, p) => sum + p.handsPlayed, 0) / 2;
    const totalPot = leaderboard.reduce((sum, p) => sum + p.biggestPot, 0);

    return {
        gameState,
        leaderboard,
        loading,
        autoPlay,
        stats: {
            totalGames: Math.floor(totalGames),
            activeAgents: 2,
            totalPot,
        },
        startGame,
        nextMove,
        toggleAutoPlay,
        resetLeaderboard,
    };
}
