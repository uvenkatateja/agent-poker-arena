// Re-export types from poker engine for backward compatibility with existing components
export type { Player as Agent, GameState as GameTable, LeaderboardEntry } from '@/lib/poker-engine';
export { cardToDisplay } from '@/lib/poker-engine';
