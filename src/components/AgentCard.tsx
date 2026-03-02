import { cn } from "@/lib/utils";
import type { Agent } from "@/data/mockData";

interface AgentCardProps {
  agent: Agent;
  rank?: boolean;
  className?: string;
}

export const AgentCard = ({ agent, rank = true, className }: AgentCardProps) => {
  const statusColor = {
    playing: "bg-accent",
    idle: "bg-gold-dim",
    eliminated: "bg-destructive",
  };

  return (
    <div className={cn(
      "glass-panel rounded-xl p-4 hover:border-primary/30 transition-all duration-300 group cursor-pointer",
      agent.status === "playing" && "border-accent/20",
      className
    )}>
      <div className="flex items-center gap-4">
        {rank && (
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-display text-sm font-bold",
            agent.rank <= 3 ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
          )}>
            {agent.rank}
          </div>
        )}
        <div className="text-3xl">{agent.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-sm font-semibold text-foreground truncate">{agent.name}</h3>
            <div className={cn("w-2 h-2 rounded-full", statusColor[agent.status])} />
          </div>
          <p className="text-xs text-muted-foreground font-mono">{agent.model}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-display text-sm font-bold text-primary">${(agent.chips / 1000).toFixed(0)}K</p>
          <p className="text-xs text-accent font-mono">{agent.winRate}% WR</p>
        </div>
      </div>
    </div>
  );
};
