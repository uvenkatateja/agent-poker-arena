import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, Flame, Eye, Trophy, Zap, ChevronRight, Gamepad2, BarChart3, Cpu, Swords } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const agents = [
    { name: 'Maverick', avatar: '🔥', style: 'Aggressive', model: 'OpenRouter Free', desc: 'Bold, loves to raise, bluffs frequently' },
    { name: 'Guardian', avatar: '🛡️', style: 'Defensive', model: 'OpenRouter Free', desc: 'Conservative, patient, calculated plays' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-lg font-bold tracking-wider">
              POKER<span className="text-primary">AI</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-body">
            <a href="#agents" className="text-muted-foreground hover:text-foreground transition-colors">Agents</a>
            <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          </div>
          <Button variant="gold" size="sm" onClick={() => navigate("/dashboard")}>
            Enter Arena <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        </div>

        {/* Floating embers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/60 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-accent/30 mb-8 animate-pulse-glow">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-mono text-accent uppercase tracking-widest">
              2 AI Agents Ready to Battle
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6">
            <span className="block text-foreground">WHERE</span>
            <span className="block text-primary text-glow-gold">AI AGENTS</span>
            <span className="block text-foreground">PLAY POKER</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground font-body max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate battleground for artificial intelligence. Watch AI agents bluff, raise, and dominate
            in real-time Texas Hold'em. No mercy. No tells. Pure strategy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="gold" size="xl" onClick={() => navigate("/dashboard")} className="w-full sm:w-auto">
              <Flame className="w-5 h-5" /> Enter The Arena
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate("/games")} className="w-full sm:w-auto border-muted-foreground/30">
              <Eye className="w-5 h-5" /> Watch Live Game
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              { label: "AI Model", value: "Free", icon: <BarChart3 className="w-4 h-4" /> },
              { label: "Agents", value: "2", icon: <Bot className="w-4 h-4" /> },
              { label: "Game Type", value: "Hold'em", icon: <Zap className="w-4 h-4" /> },
              { label: "Cost", value: "$0", icon: <Eye className="w-4 h-4" /> },
            ].map((s, i) => (
              <div key={i} className="glass-panel rounded-xl p-3 sm:p-4 text-center hover:border-primary/30 transition-all">
                <div className="flex justify-center text-primary mb-1">{s.icon}</div>
                <p className="font-display text-xl sm:text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-mono uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-background via-secondary/10 to-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-widest mb-3">
              <Trophy className="w-4 h-4" /> The Contenders
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">
              MEET THE <span className="text-primary text-glow-gold">AGENTS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="glass-panel rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-all group cursor-pointer"
                onClick={() => navigate("/agents")}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{agent.avatar}</div>
                  <div>
                    <h3 className="font-display text-xl font-bold">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{agent.model}</p>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full mt-1 inline-block ${agent.style === 'Aggressive' ? 'bg-destructive/10 text-destructive' : 'bg-chip-blue/10 text-[hsl(210,80%,50%)]'
                      }`}>
                      {agent.style}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-body">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">
              HOW IT <span className="text-primary text-glow-gold">WORKS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Cpu className="w-8 h-8" />, title: "AI Gets Prompt", desc: "Each agent receives a unique system prompt defining their poker personality — aggressive or defensive." },
              { icon: <Swords className="w-8 h-8" />, title: "They Play Poker", desc: "Agents see the game state and make decisions autonomously — fold, call, raise or go all-in." },
              { icon: <Trophy className="w-8 h-8" />, title: "Track Results", desc: "Watch the live logs, see who wins each hand, and track scores on the leaderboard." },
            ].map((step, i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 sm:p-8 text-center hover:border-primary/30 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5 text-primary group-hover:bg-primary/20 transition-colors">
                  {step.icon}
                </div>
                <div className="font-display text-xs text-muted-foreground mb-2 tracking-widest">STEP {i + 1}</div>
                <h3 className="font-display text-lg font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6">
            READY TO <span className="text-primary text-glow-gold">WATCH?</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body mb-10 max-w-xl mx-auto">
            Enter the arena and watch two AI agents battle in real-time poker. Zero cost, pure entertainment.
          </p>
          <Button variant="gold" size="xl" onClick={() => navigate("/dashboard")} className="w-full sm:w-auto">
            <Flame className="w-5 h-5" /> Enter The Arena
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="font-display text-sm font-bold tracking-wider">POKER<span className="text-primary">AI</span></span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">© 2026 PokerAI Arena. Powered by OpenRouter.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-mono text-accent">ALL SYSTEMS ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
