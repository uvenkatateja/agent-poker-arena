# 🃏 AI Poker Arena — Agent vs Agent

> **Two AI agents powered by OpenRouter's free models battle it out in real-time Texas Hold'em poker.**  
> Built with React + Vite + TypeScript + shadcn/ui + Tailwind CSS.

---

## 📋 Project Overview

AI Poker Arena is a **real-time AI-vs-AI poker dashboard** where two AI agents with different playing styles compete against each other in Texas Hold'em. Both agents use **OpenRouter's free model router** (`openrouter/free`) which automatically selects the best available free LLM (DeepSeek, Llama, Qwen, Gemma, etc.).

### 🎯 What Makes This Unique

- **No human players** — Both players are AI agents making autonomous decisions
- **Different personalities** — Same model, but different system prompts create distinct play styles
- **Zero cost** — Uses OpenRouter's completely free tier
- **Live dashboard** — Watch every move, decision, and reasoning in real-time

---

## 🤖 The Two AI Agents

| Agent | Avatar | Style | Behavior |
|-------|--------|-------|----------|
| **Maverick** | 🔥 | Aggressive | Loves to raise, bluffs frequently, prefers big pots, rarely folds |
| **Guardian** | 🛡️ | Defensive | Conservative, folds weak hands, only raises with strength, values chip preservation |

Both agents receive the same game state but respond differently because of their **unique system prompts**. This is the core mechanic — personality-driven AI poker.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│              Frontend (React + Vite)     │
│  ┌─────────┐ ┌──────┐ ┌─────────────┐  │
│  │Dashboard │ │ Game │ │ Leaderboard │  │
│  │  Page    │ │ Page │ │    Page     │  │
│  └────┬─────┘ └──┬───┘ └──────┬──────┘  │
│       │          │             │         │
│  ┌────▼──────────▼─────────────▼──────┐  │
│  │      usePokerGame() Hook           │  │
│  │  (Game State + AI + Leaderboard)   │  │
│  └────┬────────────────┬──────────────┘  │
│       │                │                 │
│  ┌────▼──────┐   ┌─────▼──────────┐     │
│  │  Poker    │   │  AI Service    │     │
│  │  Engine   │   │  (OpenRouter)  │     │
│  │(client)   │   │  (API call)    │     │
│  └───────────┘   └────────┬───────┘     │
└────────────────────────────┼─────────────┘
                             │
                    ┌────────▼────────┐
                    │  OpenRouter API  │
                    │  (Free Models)   │
                    │  openrouter/free  │
                    └─────────────────┘
```

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| **Poker Engine** | `src/lib/poker-engine.ts` | Full Texas Hold'em engine: deck, dealing, hand evaluation (all hand ranks), pot management, phase progression |
| **AI Service** | `src/lib/ai-service.ts` | Calls OpenRouter API with player-specific system prompts, parses & validates AI responses |
| **Game Hook** | `src/hooks/usePokerGame.ts` | React hook managing game state, AI turns, auto-play, and leaderboard |
| **Dashboard** | `src/pages/Dashboard.tsx` | Main page: controls, stats, poker table, move logs, leaderboard |
| **Games Page** | `src/pages/Games.tsx` | Full-screen game view with detailed log |
| **Agents Page** | `src/pages/Agents.tsx` | Agent profiles, stats, and AI personality descriptions |
| **Leaderboard** | `src/pages/Leaderboard.tsx` | Rankings with podium and detailed stats table |
| **Landing** | `src/pages/Landing.tsx` | Marketing landing page |

---

## 🎮 How a Game Works

### Game Flow

```
1. New Game Starts
   ├── Deck shuffled, 2 cards dealt to each player
   ├── Small blind ($10) and Big blind ($20) posted
   └── Phase: PRE-FLOP

2. Each Turn:
   ├── Current player's game state is sent to OpenRouter AI
   ├── AI responds with JSON: { action, amount, reason }
   ├── Response is validated (legal move? correct amount?)
   ├── Move is applied to game state
   └── Move + reasoning logged for display

3. Phase Progression:
   PRE-FLOP → FLOP (3 cards) → TURN (1 card) → RIVER (1 card) → SHOWDOWN

4. Game End:
   ├── Player folds → Opponent wins pot
   └── Showdown → Best 5-card hand wins (full hand ranking evaluation)

5. Leaderboard Updated:
   └── Winner gets +10 points, stats tracked
```

### AI Decision Making

Each turn, the AI receives a structured prompt containing:
- Their hole cards (private hand)
- Community cards on the table
- Current pot size and bet amounts
- Both players' chip counts
- Recent move history
- List of allowed actions

The AI must respond with **pure JSON only**:
```json
{
  "action": "raise",
  "amount": 60,
  "reason": "Strong hand with top pair, applying pressure"
}
```

### Move Validation

The system **never blindly trusts AI output**:
- ✅ Is the action valid? (can't check when there's a bet to match)
- ✅ Is the raise amount within legal range?
- ✅ Does the player have enough chips?
- ✅ If invalid → auto-corrected or defaulted to fold

---

## 🖥️ Dashboard Features

| Feature | Description |
|---------|-------------|
| **🎲 New Game** | Start a fresh hand with reshuffled deck |
| **▶️ Next Move** | Manually trigger the next AI move |
| **⚡ Auto Play** | Automatically plays moves every 1.5s and starts new games |
| **🔄 Reset Scores** | Clear the leaderboard |
| **♠️ Poker Table** | Green felt table showing community cards, pot, and player positions |
| **🃏 Player Cards** | Each player's hole cards, chips, bet, and status |
| **📜 Move Log** | Scrollable log of every move with AI reasoning |
| **🏆 Leaderboard** | Points, wins, losses, win rate, biggest pot |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite 5** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS 3** | Styling |
| **shadcn/ui** | UI component library |
| **Radix UI** | Accessible component primitives |
| **React Router 6** | Client-side routing |
| **TanStack Query** | Data fetching (available for future use) |
| **OpenRouter API** | Free AI model access |
| **Lucide React** | Icons |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- An OpenRouter account (free): [openrouter.ai](https://openrouter.ai)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Get your free API key from https://openrouter.ai/keys

# 3. Create .env file
echo "VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here" > .env

# 4. Run the dev server
npm run dev

# 5. Open http://localhost:8080
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENROUTER_API_KEY` | Yes | Your OpenRouter API key (get free at openrouter.ai/keys) |

---

## 📂 Project Structure

```
agent-poker-arena/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images (hero background)
│   ├── components/
│   │   ├── ui/               # shadcn/ui components (49 files)
│   │   ├── AgentCard.tsx     # Player card with hand display
│   │   ├── AppSidebar.tsx    # Navigation sidebar
│   │   ├── DashboardLayout.tsx # Layout wrapper
│   │   ├── NavLink.tsx       # Active nav link
│   │   ├── PokerTableView.tsx # Poker table visualization
│   │   └── StatCard.tsx      # Stats display card
│   ├── data/
│   │   └── mockData.ts       # Type re-exports (mock data removed)
│   ├── hooks/
│   │   ├── usePokerGame.ts   # ★ Main game hook
│   │   ├── use-mobile.tsx    # Mobile detection
│   │   └── use-toast.ts     # Toast notifications
│   ├── lib/
│   │   ├── poker-engine.ts   # ★ Full poker engine
│   │   ├── ai-service.ts     # ★ OpenRouter AI integration
│   │   └── utils.ts          # Utility functions
│   ├── pages/
│   │   ├── Dashboard.tsx     # ★ Main dashboard
│   │   ├── Games.tsx         # Live game view
│   │   ├── Agents.tsx        # Agent profiles
│   │   ├── Leaderboard.tsx   # Rankings
│   │   ├── Landing.tsx       # Landing page
│   │   └── NotFound.tsx      # 404
│   ├── App.tsx               # Router setup
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles & design tokens
├── .env                      # API key (not committed)
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

> ★ = Core files containing the game logic

---

## 🎲 Poker Engine Details

The poker engine (`src/lib/poker-engine.ts`) is a **complete Texas Hold'em implementation** running entirely client-side:

### Hand Rankings (highest to lowest)
1. 🏆 Royal Flush
2. Straight Flush
3. Four of a Kind
4. Full House
5. Flush
6. Straight
7. Three of a Kind
8. Two Pair
9. One Pair
10. High Card

### Game Phases
| Phase | Cards | Description |
|-------|-------|-------------|
| Pre-flop | 0 community | Players see only their 2 hole cards |
| Flop | 3 community | First 3 community cards revealed |
| Turn | 4 community | 4th community card revealed |
| River | 5 community | 5th and final community card |
| Showdown | 5 community | Best 5-card hand from 7 cards wins |

---

## 💰 OpenRouter API Usage

### Cost: **$0 (completely free)**

The app uses `openrouter/free` which:
- Automatically routes to available free models
- Selects from DeepSeek, Llama, Qwen, Gemma, Mistral, etc.
- No charges whatsoever
- Has rate limits (handled with retry logic)

### Rate Limit Handling
- 3 retry attempts with exponential backoff (2s → 4s → 6s)
- On complete failure, defaults to safe action (check/call)
- Auto-play pauses gracefully during rate limits

---

## 🔮 Future Improvements

- [ ] WebSocket support for real-time spectating
- [ ] More AI agents with different personalities
- [ ] Tournament mode (best of N games)
- [ ] Game replay/history persistence
- [ ] Custom agent prompt editor
- [ ] Multiple simultaneous tables
- [ ] Player vs AI mode
- [ ] Database persistence (Supabase/Firebase)

---

## 📝 License

MIT License — Free to use and modify.

---

<p align="center">
  <strong>Built with 🔥 by AI Poker Arena Team</strong><br>
  <em>Powered by OpenRouter • React • TypeScript</em>
</p>
