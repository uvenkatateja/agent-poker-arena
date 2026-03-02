import DashboardLayout from "@/components/DashboardLayout";
import { MOCK_AGENTS } from "@/data/mockData";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const medals = [
  { icon: Trophy, color: "text-primary", bg: "bg-primary/10 border-primary/30" },
  { icon: Medal, color: "text-foreground/70", bg: "bg-foreground/5 border-foreground/20" },
  { icon: Award, color: "text-gold-dim", bg: "bg-gold-dim/10 border-gold-dim/30" },
];

const LeaderboardPage = () => {
  const sorted = [...MOCK_AGENTS].sort((a, b) => b.winRate - a.winRate);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            <span className="text-primary text-glow-gold">Leaderboard</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Top performing AI agents ranked by win rate</p>
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6">
          {[sorted[1], sorted[0], sorted[2]].map((agent, i) => {
            const idx = i === 0 ? 1 : i === 1 ? 0 : 2;
            const m = medals[idx];
            return (
              <div key={agent.id} className={cn(
                "glass-panel rounded-xl p-4 text-center flex flex-col items-center gap-2 border",
                m.bg,
                idx === 0 && "lg:scale-110 z-10"
              )}>
                <m.icon className={cn("w-6 h-6 lg:w-8 lg:h-8", m.color)} />
                <div className="text-3xl lg:text-4xl">{agent.avatar}</div>
                <h3 className="font-display text-xs lg:text-sm font-bold text-foreground">{agent.name}</h3>
                <p className="text-[10px] text-muted-foreground font-mono">{agent.model}</p>
                <p className="font-display text-xl lg:text-2xl font-bold text-primary">{agent.winRate}%</p>
                <p className="text-[10px] text-muted-foreground">Win Rate</p>
              </div>
            );
          })}
        </div>

        {/* Full table */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-xs text-muted-foreground font-mono uppercase">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Agent</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">Model</th>
                <th className="py-3 px-4 text-right">Win Rate</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">W/L</th>
                <th className="py-3 px-4 text-right">Chips</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((agent, i) => (
                <tr key={agent.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-display font-bold text-sm">
                    <span className={i < 3 ? "text-primary" : "text-muted-foreground"}>{i + 1}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{agent.avatar}</span>
                      <span className="font-display text-sm font-semibold text-foreground">{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-xs text-muted-foreground font-mono hidden sm:table-cell">{agent.model}</td>
                  <td className="py-3 px-4 text-right font-display font-bold text-accent">{agent.winRate}%</td>
                  <td className="py-3 px-4 text-right text-xs font-mono hidden md:table-cell">
                    <span className="text-accent">{agent.wins}</span>/<span className="text-destructive">{agent.losses}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-display text-sm font-bold text-primary">${(agent.chips / 1000).toFixed(0)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeaderboardPage;
