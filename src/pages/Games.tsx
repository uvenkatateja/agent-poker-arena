import DashboardLayout from "@/components/DashboardLayout";
import { PokerTableView } from "@/components/PokerTableView";
import { AgentCard } from "@/components/AgentCard";
import { usePokerGame } from "@/hooks/usePokerGame";
import { Button } from "@/components/ui/button";
import { Flame, Play, Square, RotateCcw, Sparkles } from "lucide-react";
import { cardToDisplay } from "@/lib/poker-engine";

const GamesPage = () => {
  const {
    gameState,
    loading,
    autoPlay,
    startGame,
    nextMove,
    toggleAutoPlay,
  } = usePokerGame();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Live <span className="text-accent text-glow-green">Game</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Watch AI agents battle in real-time</p>
          </div>
          <div className="flex items-center gap-2">
            {gameState && gameState.phase !== 'finished' && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 mr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-mono text-accent">LIVE</span>
              </div>
            )}
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
              {autoPlay ? <><Square className="w-4 h-4 mr-1" /> Stop</> : <><Sparkles className="w-4 h-4 mr-1" /> Auto</>}
            </Button>
          </div>
        </div>

        {gameState && (
          <>
            {/* Poker Table */}
            <PokerTableView
              agents={gameState.players}
              communityCards={gameState.communityCards.map(cardToDisplay)}
              pot={gameState.pot}
              round={gameState.phase}
              winner={gameState.winner}
              winReason={gameState.winReason}
              currentPlayerIndex={gameState.currentPlayerIndex}
            />

            {/* Players */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Game Log */}
            <div className="glass-panel rounded-xl p-4">
              <h3 className="font-display text-sm font-bold mb-3 text-foreground flex items-center gap-2">
                <Flame className="w-4 h-4 text-accent" /> Game Log
                <span className="text-[10px] text-muted-foreground font-mono ml-auto">{gameState.moves.length} moves</span>
              </h3>
              <div className="space-y-1.5 font-mono text-xs max-h-64 overflow-y-auto">
                {gameState.moves.map((move, i) => {
                  const isSystem = move.player === 'System';
                  const isMaverick = move.player === 'Maverick';
                  return (
                    <div key={i} className={`flex items-start gap-2 p-2 rounded-lg ${isSystem ? 'bg-secondary/30 text-muted-foreground' :
                        isMaverick ? 'bg-destructive/5' : 'bg-chip-blue/5'
                      }`}>
                      <span className={`font-bold min-w-[65px] ${isSystem ? 'text-muted-foreground' :
                          isMaverick ? 'text-destructive' : 'text-[hsl(210,80%,50%)]'
                        }`}>
                        {isMaverick ? '🔥' : isSystem ? '⚙️' : '🛡️'} {move.player}
                      </span>
                      <span className="text-primary font-semibold uppercase text-[10px] px-1.5 py-0.5 bg-primary/10 rounded">
                        {move.action}{move.amount > 0 ? ` $${move.amount}` : ''}
                      </span>
                      <span className="text-muted-foreground italic flex-1 truncate">{move.reason}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GamesPage;
