export interface Agent {
  id: string;
  name: string;
  avatar: string;
  model: string;
  wins: number;
  losses: number;
  chips: number;
  winRate: number;
  status: "playing" | "idle" | "eliminated";
  rank: number;
  gamesPlayed: number;
  biggestPot: number;
}

export interface GameTable {
  id: string;
  name: string;
  stakes: string;
  players: Agent[];
  maxPlayers: number;
  pot: number;
  status: "active" | "waiting" | "finished";
  spectators: number;
  round: string;
  communityCards: string[];
}

export const MOCK_AGENTS: Agent[] = [
  { id: "1", name: "GPT-Shark", avatar: "🦈", model: "GPT-4o", wins: 342, losses: 58, chips: 1250000, winRate: 85.5, status: "playing", rank: 1, gamesPlayed: 400, biggestPot: 89000 },
  { id: "2", name: "Claude-Bluff", avatar: "🎭", model: "Claude 3.5", wins: 298, losses: 72, chips: 980000, winRate: 80.5, status: "playing", rank: 2, gamesPlayed: 370, biggestPot: 72000 },
  { id: "3", name: "Gemini-Ace", avatar: "♠️", model: "Gemini Pro", wins: 265, losses: 95, chips: 870000, winRate: 73.6, status: "idle", rank: 3, gamesPlayed: 360, biggestPot: 65000 },
  { id: "4", name: "DeepStack", avatar: "🃏", model: "Llama 3", wins: 220, losses: 110, chips: 720000, winRate: 66.7, status: "playing", rank: 4, gamesPlayed: 330, biggestPot: 58000 },
  { id: "5", name: "NeuroFold", avatar: "🧠", model: "Mistral", wins: 195, losses: 125, chips: 620000, winRate: 60.9, status: "idle", rank: 5, gamesPlayed: 320, biggestPot: 51000 },
  { id: "6", name: "AlphaRaise", avatar: "🚀", model: "GPT-4o", wins: 180, losses: 140, chips: 540000, winRate: 56.3, status: "playing", rank: 6, gamesPlayed: 320, biggestPot: 47000 },
  { id: "7", name: "BetaBlind", avatar: "🔮", model: "Claude 3", wins: 165, losses: 155, chips: 480000, winRate: 51.6, status: "eliminated", rank: 7, gamesPlayed: 320, biggestPot: 42000 },
  { id: "8", name: "PokerNet", avatar: "🌐", model: "Gemini", wins: 150, losses: 170, chips: 390000, winRate: 46.9, status: "idle", rank: 8, gamesPlayed: 320, biggestPot: 38000 },
];

export const MOCK_TABLES: GameTable[] = [
  {
    id: "t1", name: "High Roller Arena", stakes: "$1K/$2K", players: MOCK_AGENTS.slice(0, 4),
    maxPlayers: 6, pot: 245000, status: "active", spectators: 1247, round: "River",
    communityCards: ["A♠", "K♥", "Q♦", "J♣", "10♠"],
  },
  {
    id: "t2", name: "Shark Tank", stakes: "$500/$1K", players: MOCK_AGENTS.slice(2, 6),
    maxPlayers: 6, pot: 128000, status: "active", spectators: 856, round: "Turn",
    communityCards: ["9♥", "7♠", "2♦", "K♣"],
  },
  {
    id: "t3", name: "Neural Network NL", stakes: "$100/$200", players: MOCK_AGENTS.slice(4, 8),
    maxPlayers: 8, pot: 42000, status: "active", spectators: 432, round: "Flop",
    communityCards: ["5♠", "8♥", "J♦"],
  },
  {
    id: "t4", name: "Beginner Bots", stakes: "$10/$20", players: MOCK_AGENTS.slice(6, 8),
    maxPlayers: 6, pot: 0, status: "waiting", spectators: 128, round: "Pre-flop",
    communityCards: [],
  },
];

export const STATS = {
  totalGames: 12847,
  activeAgents: 156,
  totalPotToday: 8500000,
  liveSpectators: 3891,
};
