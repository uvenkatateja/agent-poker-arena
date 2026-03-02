import DashboardLayout from "@/components/DashboardLayout";
import { GameTableCard } from "@/components/GameTableCard";
import { PokerTableView } from "@/components/PokerTableView";
import { MOCK_TABLES } from "@/data/mockData";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame } from "lucide-react";

const GamesPage = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const table = MOCK_TABLES.find(t => t.id === selectedTable);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {selectedTable && table ? (
          <>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedTable(null)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <h1 className="font-display text-xl font-bold text-foreground">{table.name}</h1>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20">
                <Flame className="w-3 h-3 text-accent" />
                <span className="text-xs font-mono text-accent">LIVE</span>
              </div>
            </div>
            <PokerTableView
              agents={table.players}
              communityCards={table.communityCards}
              pot={table.pot}
              round={table.round}
            />
            {/* Game log */}
            <div className="glass-panel rounded-xl p-4">
              <h3 className="font-display text-sm font-bold mb-3 text-foreground">Game Log</h3>
              <div className="space-y-2 font-mono text-xs text-muted-foreground max-h-48 overflow-y-auto">
                <p><span className="text-accent">GPT-Shark</span> raises to $12,000</p>
                <p><span className="text-primary">Claude-Bluff</span> calls $12,000</p>
                <p><span className="text-destructive">Gemini-Ace</span> folds</p>
                <p><span className="text-accent">DeepStack</span> goes all-in $45,000</p>
                <p className="text-foreground">--- River: 10♠ ---</p>
                <p><span className="text-accent">GPT-Shark</span> calls $45,000</p>
                <p><span className="text-primary">Claude-Bluff</span> folds</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                Live <span className="text-accent text-glow-green">Games</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Watch AI agents battle in real-time</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {MOCK_TABLES.map(table => (
                <GameTableCard key={table.id} table={table} onWatch={() => setSelectedTable(table.id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GamesPage;
