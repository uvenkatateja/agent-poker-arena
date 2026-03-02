import DashboardLayout from "@/components/DashboardLayout";
import { usePokerGame } from "@/hooks/usePokerGame";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const medals = [
  { icon: Trophy, color: "text-primary", bg: "bg-primary/10 border-primary/30" },
  { icon: Medal, color: "text-foreground/70", bg: "bg-foreground/5 border-foreground/20" },
  { icon: Award, color: "text-gold-dim", bg: "bg-gold-dim/10 border-gold-dim/30" },
];

const LeaderboardPage = () => {
  const { leaderboard } = usePokerGame();

  // Pad to at least 2 entries for podium display
  const sorted = [...leaderboard];
  while (sorted.length < 2) {
    sorted.push({
      name: '—', avatar: '❓', model: 'N/A', style: '',
      wins: 0, losses: 0, totalPoints: 0, handsPlayed: 0,
      biggestPot: 0, winRate: 0, chips: 0,
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            <span className="text-primary text-glow-gold">Leaderboard</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">AI agents ranked by total points</p>
        </div>

        {/* Top 2 podium */}
        <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-6 max-w-xl mx-auto">
          {sorted.slice(0, 2).map((agent, i) => {
            const m = medals[i];
            return (
              <div key={agent.name} className={cn(
                "glass-panel rounded-xl p-5 text-center flex flex-col items-center gap-2 border",
                m.bg,
                i === 0 && "lg:scale-105 z-10"
              )}>
                <m.icon className={cn("w-7 h-7 lg:w-9 lg:h-9", m.color)} />
                <div className="text-4xl lg:text-5xl">{agent.avatar}</div>
                <h3 className="font-display text-sm lg:text-base font-bold text-foreground">{agent.name}</h3>
                <p className="text-[10px] text-muted-foreground font-mono">{agent.model}</p>
                <p className="font-display text-2xl lg:text-3xl font-black text-primary">{agent.totalPoints}</p>
                <p className="text-[10px] text-muted-foreground">Total Points</p>
                <div className="flex gap-4 mt-1">
                  <div className="text-center">
                    <p className="text-accent font-display font-bold text-sm">{agent.wins}</p>
                    <p className="text-[9px] text-muted-foreground font-mono">WINS</p>
                  </div>
                  <div className="text-center">
                    <p className="text-destructive font-display font-bold text-sm">{agent.losses}</p>
                    <p className="text-[9px] text-muted-foreground font-mono">LOSSES</p>
                  </div>
                  <div className="text-center">
                    <p className="text-accent font-display font-bold text-sm">{agent.winRate}%</p>
                    <p className="text-[9px] text-muted-foreground font-mono">W/R</p>
                  </div>
                </div>
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
                <th className="py-3 px-4 text-right">Points</th>
                <th className="py-3 px-4 text-right">Win Rate</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">W/L</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Games</th>
                <th className="py-3 px-4 text-right">Best Pot</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((agent, i) => (
                <tr key={agent.name + i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-display font-bold text-sm">
                    <span className={i < 1 ? "text-primary" : "text-muted-foreground"}>
                      {i === 0 ? '👑' : '🥈'} {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{agent.avatar}</span>
                      <div>
                        <span className="font-display text-sm font-semibold text-foreground">{agent.name}</span>
                        <p className="text-[10px] text-muted-foreground font-mono">{agent.style || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-display font-bold text-primary text-lg">{agent.totalPoints}</td>
                  <td className="py-3 px-4 text-right font-display font-bold text-accent">{agent.winRate}%</td>
                  <td className="py-3 px-4 text-right text-xs font-mono hidden sm:table-cell">
                    <span className="text-accent">{agent.wins}</span>/<span className="text-destructive">{agent.losses}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-xs text-muted-foreground font-mono hidden md:table-cell">{agent.handsPlayed}</td>
                  <td className="py-3 px-4 text-right font-display text-sm font-bold text-primary">${agent.biggestPot}</td>
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
