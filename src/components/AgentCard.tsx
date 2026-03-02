import { cn } from "@/lib/utils";
import type { Player } from "@/lib/poker-engine";
import { cardToDisplay } from "@/lib/poker-engine";

interface AgentCardProps {
  agent: Player;
  isActive?: boolean;
  isWinner?: boolean;
  showHand?: boolean;
  rank?: boolean;
  className?: string;
}

export const AgentCard = ({ agent, isActive, isWinner, showHand, className }: AgentCardProps) => {
  const statusColor = agent.folded
    ? "bg-destructive"
    : agent.isAllIn
      ? "bg-primary"
      : isActive
        ? "bg-accent animate-pulse"
        : "bg-muted-foreground";

  return (
    <div className={cn(
      "glass-panel rounded-xl p-4 hover:border-primary/30 transition-all duration-300 group cursor-pointer relative overflow-hidden",
      isActive && "border-accent/40 border-glow-green",
      isWinner && "border-primary/40 border-glow-gold",
      agent.folded && "opacity-50",
      className
    )}>
      {/* Top accent bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-0.5",
        agent.style === 'aggressive' ? 'bg-gradient-to-r from-destructive to-primary' : 'bg-gradient-to-r from-[hsl(210,80%,50%)] to-accent'
      )} />

      <div className="flex items-center gap-3">
        <div className="text-3xl">{agent.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-sm font-semibold text-foreground truncate">{agent.name}</h3>
            <div className={cn("w-2 h-2 rounded-full", statusColor)} />
            {isActive && <span className="text-[10px] text-accent font-mono animate-pulse">THINKING...</span>}
            {isWinner && <span className="text-[10px] text-primary font-mono">🏆 WINNER</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn(
              "text-[10px] font-mono px-1.5 py-0.5 rounded",
              agent.style === 'aggressive' ? 'bg-destructive/10 text-destructive' : 'bg-[hsl(210,80%,50%)]/10 text-[hsl(210,80%,50%)]'
            )}>
              {agent.style.toUpperCase()}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{agent.model}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-bold text-primary">${agent.chips}</p>
          <p className="text-[10px] text-muted-foreground font-mono">Bet: ${agent.currentBet}</p>
        </div>
      </div>

      {/* Player hand */}
      {showHand && agent.hand.length > 0 && (
        <div className="flex gap-1.5 mt-3">
          {agent.hand.map((card, i) => {
            const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
            return (
              <div key={i} className={cn(
                "w-10 h-14 rounded-md flex flex-col items-center justify-center text-xs font-bold shadow-lg animate-card-deal border-2",
                isRed ? "bg-foreground/95 text-destructive border-foreground/80" : "bg-foreground/95 text-background border-foreground/80"
              )} style={{ animationDelay: `${i * 0.15}s` }}>
                <span className="text-sm leading-none">{card.rank}</span>
                <span className="text-base leading-none">{cardToDisplay(card).slice(-1)}</span>
              </div>
            );
          })}
          {agent.folded && (
            <span className="text-destructive font-display text-xs font-bold self-center ml-2">FOLDED</span>
          )}
          {agent.isAllIn && !agent.folded && (
            <span className="text-primary font-display text-xs font-bold self-center ml-2">ALL IN</span>
          )}
        </div>
      )}
    </div>
  );
};
