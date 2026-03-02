import { cn } from "@/lib/utils";
import type { Agent } from "@/data/mockData";

interface PokerTableViewProps {
  agents: Agent[];
  communityCards: string[];
  pot: number;
  round: string;
  className?: string;
}

export const PokerTableView = ({ agents, communityCards, pot, round, className }: PokerTableViewProps) => {
  // Position agents around the table
  const positions = [
    "bottom-4 left-1/2 -translate-x-1/2",        // bottom center
    "top-4 left-1/2 -translate-x-1/2",            // top center
    "left-4 top-1/2 -translate-y-1/2",             // left center
    "right-4 top-1/2 -translate-y-1/2",            // right center
    "top-12 left-12",                               // top-left
    "top-12 right-12",                              // top-right
    "bottom-12 left-12",                            // bottom-left
    "bottom-12 right-12",                           // bottom-right
  ];

  return (
    <div className={cn("relative w-full aspect-[16/10] max-w-4xl mx-auto", className)}>
      {/* Table */}
      <div className="absolute inset-8 lg:inset-12 rounded-[50%] bg-felt border-4 border-gold-dim/40 shadow-2xl">
        {/* Inner felt ring */}
        <div className="absolute inset-4 rounded-[50%] border border-gold-dim/20" />
        
        {/* Center - Pot & Cards */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-mono uppercase">{round}</p>
            <p className="font-display text-xl lg:text-2xl font-bold text-primary text-glow-gold">${pot.toLocaleString()}</p>
          </div>
          <div className="flex gap-1.5 lg:gap-2">
            {communityCards.length > 0 ? communityCards.map((card, i) => (
              <div key={i} className="w-8 h-12 lg:w-12 lg:h-16 rounded bg-foreground/95 flex items-center justify-center text-background font-bold text-xs lg:text-sm shadow-lg animate-card-deal" style={{ animationDelay: `${i * 0.15}s` }}>
                {card}
              </div>
            )) : (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-8 h-12 lg:w-12 lg:h-16 rounded bg-secondary/40 border border-border/30" />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Agent seats */}
      {agents.map((agent, i) => (
        <div key={agent.id} className={cn("absolute z-10", positions[i % positions.length])}>
          <div className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl glass-panel",
            agent.status === "playing" && "border-accent/30",
            agent.status === "eliminated" && "opacity-40"
          )}>
            <div className="text-2xl lg:text-3xl">{agent.avatar}</div>
            <p className="text-[10px] lg:text-xs font-display font-semibold text-foreground truncate max-w-16 lg:max-w-20">{agent.name}</p>
            <p className="text-[10px] font-mono text-primary">${(agent.chips / 1000).toFixed(0)}K</p>
          </div>
        </div>
      ))}
    </div>
  );
};
