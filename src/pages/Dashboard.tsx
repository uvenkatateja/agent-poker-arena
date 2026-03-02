import { BarChart3, Bot, Flame, Trophy, Zap, Play, Square, RotateCcw, Sparkles } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AgentCard } from "@/components/AgentCard";
import { PokerTableView } from "@/components/PokerTableView";
import DashboardLayout from "@/components/DashboardLayout";
import { usePokerGame } from "@/hooks/usePokerGame";
import { Button } from "@/components/ui/button";
import { cardToDisplay } from "@/lib/poker-engine";

const Dashboard = () => {
  const {
    gameState,
    leaderboard,
    loading,
    autoPlay,
    stats,
    startGame,
    nextMove,
    toggleAutoPlay,
    resetLeaderboard,
  } = usePokerGame();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              AI Poker <span className="text-primary text-glow-gold">Arena</span>
            </h1>
            <p className="text-sm text-muted-foreground font-body mt-1">
              Two AI agents battling in real-time Texas Hold'em
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="gold" size="sm" onClick={startGame} disabled={loading && !autoPlay}>
              <RotateCcw className="w-4 h-4 mr-1" /> New Game
            </Button>
            <Button variant="neon" size="sm" onClick={nextMove} disabled={loading || !gameState || gameState.phase === 'finished'}>
              <Play className="w-4 h-4 mr-1" /> Next Move
            </Button>
            <Button
              variant={autoPlay ? "destructive" : "outline"}
              size="sm"
              onClick={toggleAutoPlay}
              className={autoPlay ? "" : "border-accent/30 text-accent hover:bg-accent/10"}
            >
              {autoPlay ? <><Square className="w-4 h-4 mr-1" /> Stop</> : <><Sparkles className="w-4 h-4 mr-1" /> Auto Play</>}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetLeaderboard}>
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatCard label="Games Played" value={stats.totalGames} icon={<BarChart3 className="w-5 h-5" />} trend={gameState ? `Round #${gameState.round}` : ''} />
          <StatCard label="Active Agents" value={stats.activeAgents} icon={<Bot className="w-5 h-5" />} trend="Maverick & Guardian" />
          <StatCard label="Current Pot" value={gameState ? `$${gameState.pot}` : '$0'} icon={<Zap className="w-5 h-5" />} trend={gameState ? gameState.phase.toUpperCase() : ''} />
          <StatCard
            label="Status"
            value={loading ? 'Thinking...' : gameState?.phase === 'finished' ? 'Game Over' : 'Ready'}
            icon={<Flame className="w-5 h-5" />}
            trend={autoPlay ? '⚡ AUTO MODE' : ''}
          />
        </div>

        {/* Game Table & Players */}
        {gameState && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Poker Table — wider */}
            <div className="xl:col-span-2">
              <PokerTableView
                agents={gameState.players}
                communityCards={gameState.communityCards.map(cardToDisplay)}
                pot={gameState.pot}
                round={gameState.phase}
                winner={gameState.winner}
                winReason={gameState.winReason}
                currentPlayerIndex={gameState.currentPlayerIndex}
              />
            </div>

            {/* Players sidebar */}
            <div className="space-y-3">
              <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-primary" /> AI Players
                <span className="text-[10px] text-muted-foreground font-mono ml-auto">OpenRouter Free</span>
              </h2>
              {gameState.players.map((player, i) => (
                <AgentCard
                  key={player.id}
                  agent={player}
                  isActive={gameState.currentPlayerIndex === i && gameState.phase !== 'finished'}
                  isWinner={gameState.winner === player.name}
                  showHand
                />
              ))}
            </div>
          </div>
        )}

        {/* Move Logs + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Logs */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                <Flame className="w-4 h-4 text-accent" /> Move Log
              </h2>
              <span className="text-[10px] text-muted-foreground font-mono">
                {gameState?.moves.length || 0} moves
              </span>
            </div>
            <div className="p-4 max-h-72 overflow-y-auto space-y-1.5">
              {gameState?.moves.map((move, i) => {
                const isSystem = move.player === 'System';
                const isMaverick = move.player === 'Maverick';
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-2 text-xs p-2 rounded-lg ${isSystem ? 'bg-secondary/30' :
                        isMaverick ? 'bg-destructive/5 border-l-2 border-destructive/30' :
                          'bg-chip-blue/5 border-l-2 border-chip-blue/30'
                      }`}
                  >
                    <span className={`font-display font-bold min-w-[70px] ${isSystem ? 'text-muted-foreground' :
                        isMaverick ? 'text-destructive' : 'text-[hsl(210,80%,50%)]'
                      }`}>
                      {isSystem ? '⚙️' : isMaverick ? '🔥' : '🛡️'} {move.player}
                    </span>
                    <span className="text-primary font-mono font-semibold uppercase text-[10px] px-1.5 py-0.5 bg-primary/10 rounded">
                      {move.action}{move.amount > 0 ? ` $${move.amount}` : ''}
                    </span>
                    <span className="text-muted-foreground italic flex-1 truncate">{move.reason}</span>
                  </div>
                );
              })}
              {(!gameState || gameState.moves.length === 0) && (
                <div className="text-center text-muted-foreground text-xs py-8">No moves yet. Start a game!</div>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" /> Leaderboard
              </h2>
              <span className="text-[10px] text-muted-foreground font-mono">All-time</span>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] text-muted-foreground font-mono uppercase">
                    <th className="py-2 text-left">#</th>
                    <th className="py-2 text-left">Agent</th>
                    <th className="py-2 text-right">Pts</th>
                    <th className="py-2 text-right">W</th>
                    <th className="py-2 text-right">L</th>
                    <th className="py-2 text-right">WR%</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <tr key={entry.name} className="border-t border-border/20 hover:bg-secondary/20 transition-colors">
                      <td className="py-3">
                        <span className={`font-display font-bold text-sm ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                          {i === 0 ? '👑' : '🥈'} {i + 1}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{entry.avatar}</span>
                          <span className="font-display text-sm font-semibold">{entry.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-display font-bold text-primary">{entry.totalPoints}</td>
                      <td className="py-3 text-right font-mono text-xs text-accent">{entry.wins}</td>
                      <td className="py-3 text-right font-mono text-xs text-destructive">{entry.losses}</td>
                      <td className="py-3 text-right font-mono text-xs text-accent">{entry.winRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
