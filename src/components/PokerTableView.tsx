import { cn } from "@/lib/utils";
import type { Player } from "@/lib/poker-engine";

interface PokerTableViewProps {
  agents: Player[];
  communityCards: string[];
  pot: number;
  round: string;
  winner?: string | null;
  winReason?: string | null;
  currentPlayerIndex?: number;
  className?: string;
}

export const PokerTableView = ({ agents, communityCards, pot, round, winner, winReason, currentPlayerIndex, className }: PokerTableViewProps) => {
  return (
    <div className={cn("relative w-full max-w-4xl mx-auto", className)}>
      {/* Table container */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Felt table */}
        <div className="relative bg-felt rounded-2xl border-4 border-gold-dim/40 shadow-2xl p-8 min-h-[300px] lg:min-h-[360px]">
          {/* Inner felt ring */}
          <div className="absolute inset-6 rounded-xl border border-gold-dim/15 pointer-events-none" />

          {/* Player seats at top and bottom */}
          <div className="flex justify-between items-start mb-8">
            {agents.map((agent, i) => (
              <div key={agent.id} className={cn(
                "flex flex-col items-center gap-1 p-2 px-3 rounded-xl glass-panel min-w-[80px]",
                currentPlayerIndex === i && round !== 'finished' && "border-accent/40 shadow-[0_0_10px_hsl(142,70%,45%,0.2)]",
                winner === agent.name && "border-primary/40 shadow-[0_0_10px_hsl(45,100%,50%,0.3)]",
                agent.folded && "opacity-40"
              )}>
                <div className="text-2xl lg:text-3xl">{agent.avatar}</div>
                <p className="text-[10px] lg:text-xs font-display font-semibold text-foreground">{agent.name}</p>
                <p className="text-[10px] font-mono text-primary">${agent.chips}</p>
                {currentPlayerIndex === i && round !== 'finished' && !agent.folded && (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {/* Center - Phase, Pot & Community Cards */}
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Phase badge */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full",
                round === 'finished' ? 'bg-primary/20 text-primary' :
                  round === 'pre-flop' ? 'bg-chip-blue/20 text-[hsl(210,80%,50%)]' :
                    'bg-accent/20 text-accent'
              )}>
                {round === 'finished' ? '🏆 GAME OVER' : round}
              </span>
              {round !== 'finished' && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-mono text-accent">LIVE</span>
                </div>
              )}
            </div>

            {/* Pot */}
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">POT</p>
              <p className="font-display text-3xl lg:text-4xl font-black text-primary text-glow-gold">${pot.toLocaleString()}</p>
            </div>

            {/* Community Cards */}
            <div className="flex gap-2 lg:gap-3 justify-center">
              {communityCards.length > 0 ? communityCards.map((card, i) => {
                const isRed = card.includes('♥') || card.includes('♦');
                return (
                  <div key={i} className={cn(
                    "w-11 h-16 lg:w-14 lg:h-20 rounded-lg flex items-center justify-center font-bold text-sm lg:text-base shadow-lg animate-card-deal border-2",
                    isRed ? "bg-foreground/95 text-destructive border-foreground/80" : "bg-foreground/95 text-background border-foreground/80"
                  )} style={{ animationDelay: `${i * 0.15}s` }}>
                    {card}
                  </div>
                );
              }) : (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-11 h-16 lg:w-14 lg:h-20 rounded-lg bg-secondary/30 border border-border/20 flex items-center justify-center text-muted-foreground text-xs">
                    ?
                  </div>
                ))
              )}
            </div>

            {/* Winner banner */}
            {winner && (
              <div className="text-center px-6 py-3 rounded-xl bg-primary/10 border border-primary/30 animate-chip-bounce">
                <p className="font-display text-lg font-black text-primary text-glow-gold">
                  🏆 {winner} Wins!
                </p>
                <p className="text-xs text-muted-foreground font-body mt-1">{winReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
