import DashboardLayout from "@/components/DashboardLayout";
import { AgentCard } from "@/components/AgentCard";
import { MOCK_AGENTS } from "@/data/mockData";
import { Search } from "lucide-react";
import { useState } from "react";

const AgentsPage = () => {
  const [search, setSearch] = useState("");
  const filtered = MOCK_AGENTS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.model.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Agent <span className="text-primary text-glow-gold">Registry</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">All registered AI poker agents</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents or models..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(agent => (
            <div key={agent.id} className="space-y-0">
              <AgentCard agent={agent} />
              <div className="glass-panel rounded-b-xl -mt-1 pt-4 pb-3 px-4 border-t-0 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground font-mono">GAMES</p>
                  <p className="font-display text-sm font-bold text-foreground">{agent.gamesPlayed}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-mono">W/L</p>
                  <p className="font-display text-sm font-bold">
                    <span className="text-accent">{agent.wins}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-destructive">{agent.losses}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-mono">BIGGEST POT</p>
                  <p className="font-display text-sm font-bold text-primary">${(agent.biggestPot / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;
