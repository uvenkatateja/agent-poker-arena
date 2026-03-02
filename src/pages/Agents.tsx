import DashboardLayout from "@/components/DashboardLayout";
import { AgentCard } from "@/components/AgentCard";
import { usePokerGame } from "@/hooks/usePokerGame";
import { Bot } from "lucide-react";

const AgentsPage = () => {
  const { gameState, leaderboard } = usePokerGame();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Agent <span className="text-primary text-glow-gold">Registry</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">The two AI poker agents battling it out</p>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameState?.players.map((player, i) => {
            const stats = leaderboard.find(l => l.name === player.name);
            return (
              <div key={player.id} className="space-y-0">
                <AgentCard
                  agent={player}
                  isActive={gameState.currentPlayerIndex === i && gameState.phase !== 'finished'}
                  isWinner={gameState.winner === player.name}
                  showHand
                />
                {/* Extended stats */}
                <div className="glass-panel rounded-b-xl -mt-1 pt-4 pb-3 px-4 border-t-0 grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-mono">GAMES</p>
                    <p className="font-display text-sm font-bold text-foreground">{stats?.handsPlayed || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-mono">W/L</p>
                    <p className="font-display text-sm font-bold">
                      <span className="text-accent">{stats?.wins || 0}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-destructive">{stats?.losses || 0}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-mono">WIN RATE</p>
                    <p className="font-display text-sm font-bold text-accent">{stats?.winRate || 0}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-mono">BEST POT</p>
                    <p className="font-display text-sm font-bold text-primary">${stats?.biggestPot || 0}</p>
                  </div>
                </div>

                {/* Agent description */}
                <div className="glass-panel rounded-xl mt-3 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-xs font-bold text-foreground">AI PERSONALITY</h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">
                    {player.style === 'aggressive' ? (
                      <>🔥 <strong>Maverick</strong> is an aggressive, bold player who loves to raise and apply pressure. Bluffs frequently, prefers big pots and high-risk plays. Rarely folds — would rather go down swinging.</>
                    ) : (
                      <>🛡️ <strong>Guardian</strong> is a conservative, calculated player who prefers to call and fold weak hands. Only raises with strong hands. Patient, analytical, and values chip preservation above all.</>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Model info */}
        <div className="glass-panel rounded-xl p-4">
          <h3 className="font-display text-sm font-bold mb-2 text-foreground">🤖 Model Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground font-body">
            <div>
              <p className="font-mono text-primary mb-1">API Provider</p>
              <p>OpenRouter (Free Tier)</p>
            </div>
            <div>
              <p className="font-mono text-primary mb-1">Model Router</p>
              <p>openrouter/free — Auto-selects from DeepSeek, Llama, Qwen, Gemma, etc.</p>
            </div>
            <div>
              <p className="font-mono text-primary mb-1">Differentiation</p>
              <p>Same model, different system prompts create distinct play styles</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;
