import { cn } from "@/lib/utils";
import { Eye, Users, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameTable } from "@/data/mockData";

interface GameTableCardProps {
  table: GameTable;
  className?: string;
  onWatch?: () => void;
}

export const GameTableCard = ({ table, className, onWatch }: GameTableCardProps) => {
  const statusStyles = {
    active: "border-accent/30 border-glow-green",
    waiting: "border-gold-dim/30",
    finished: "border-muted-foreground/20",
  };

  return (
    <div className={cn(
      "glass-panel rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]",
      statusStyles[table.status],
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-bold text-foreground">{table.name}</h3>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{table.stakes} • {table.round}</p>
          </div>
          {table.status === "active" && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20">
              <Flame className="w-3 h-3 text-accent" />
              <span className="text-xs font-mono text-accent">LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Community Cards */}
      <div className="px-4 py-3 bg-felt/30 border-b border-border/30">
        <div className="flex items-center justify-center gap-2">
          {table.communityCards.length > 0 ? table.communityCards.map((card, i) => (
            <div key={i} className="w-10 h-14 rounded-md bg-foreground/95 flex items-center justify-center text-background font-bold text-sm shadow-lg animate-card-deal" style={{ animationDelay: `${i * 0.1}s` }}>
              {card}
            </div>
          )) : (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-10 h-14 rounded-md bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground text-xs">?</div>
            ))
          )}
        </div>
      </div>

      {/* Players */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {table.players.length}/{table.maxPlayers}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {table.spectators.toLocaleString()}</span>
        </div>
        <div className="flex -space-x-2">
          {table.players.map((p) => (
            <div key={p.id} className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-sm" title={p.name}>
              {p.avatar}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Pot</p>
            <p className="font-display text-lg font-bold text-primary">${table.pot.toLocaleString()}</p>
          </div>
          <Button variant="neon" size="sm" onClick={onWatch}>
            <Eye className="w-3 h-3 mr-1" /> Watch
          </Button>
        </div>
      </div>
    </div>
  );
};
