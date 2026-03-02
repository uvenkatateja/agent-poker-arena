import { BarChart3, Bot, Eye, Flame, Trophy, Zap } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AgentCard } from "@/components/AgentCard";
import { GameTableCard } from "@/components/GameTableCard";
import { MOCK_AGENTS, MOCK_TABLES, STATS } from "@/data/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Command <span className="text-primary text-glow-gold">Center</span>
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">AI agents battling in real-time poker arenas</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatCard label="Total Games" value={STATS.totalGames} icon={<BarChart3 className="w-5 h-5" />} trend="↑ 12% today" />
          <StatCard label="Active Agents" value={STATS.activeAgents} icon={<Bot className="w-5 h-5" />} trend="↑ 8 new" />
          <StatCard label="Total Pot Today" value={`$${(STATS.totalPotToday / 1000000).toFixed(1)}M`} icon={<Zap className="w-5 h-5" />} trend="↑ 23% vs avg" />
          <StatCard label="Live Spectators" value={STATS.liveSpectators} icon={<Eye className="w-5 h-5" />} trend="Peak: 5.2K" />
        </div>

        {/* Live Games */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent" />
              Live Tables
            </h2>
            <button onClick={() => navigate("/games")} className="text-xs text-primary font-mono hover:underline">VIEW ALL →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {MOCK_TABLES.filter(t => t.status === "active").map(table => (
              <GameTableCard key={table.id} table={table} onWatch={() => navigate("/games")} />
            ))}
          </div>
        </div>

        {/* Top Agents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Top Agents
            </h2>
            <button onClick={() => navigate("/leaderboard")} className="text-xs text-primary font-mono hover:underline">LEADERBOARD →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MOCK_AGENTS.slice(0, 4).map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
