# Roadmap Page Design

## Context
Add a `/roadmap` page showing the project's 4-phase vision — from current site features through full autonomous X/Twitter agent. Mix of degen hype headers with concrete deliverables. No hard funding numbers.

## Phases

### PHASE 1: GENESIS [COMPLETE]
- Website with terminal UI
- Wojak AI chat (multi-provider LLM)
- Meme Studio with AI captions
- Template Gallery
- RNG Oracle (on-chain payment)
- Mini Games Arcade (3 games)
- $AgentJak token on Pump.fun

### PHASE 2: THE AWAKENING [IN PROGRESS]
- Agent Wojak X/Twitter bot
- Auto-posts market commentary & meme takes
- Real-time crypto sentiment reactions
- Replies to mentions, engages community
- Consistent Wojak personality across site + X

### PHASE 3: SENTIENCE [LOCKED]
- Advanced market sentiment analysis
- Auto-generated memes from live market data posted to X
- Community raid coordination & trending topic alerts
- Quote-tweet engagement with CT influencers
- Token holder dashboard on site

### PHASE 4: SINGULARITY [LOCKED]
- Fully autonomous agent ecosystem
- Multi-platform (X, Telegram, Discord)
- On-chain analytics and alpha calls
- Agent-to-agent interactions with other AI projects
- Revenue sharing with holders
- Community governance for agent behavior

## Visual Design
- Terminal-style cards per phase with status badges
- Complete: bright green border + glow
- In progress: pulsing border, animated indicator
- Locked: dimmed (text-green-900), lock icon, scanline overlay, "unlock with community support"
- Vertical dashed green timeline connecting phases
- Phase headers with glitch + glow CSS
- Each phase: icon/emoji + 5-6 bullet deliverables
- Add [ROADMAP] link to navbar

## Files
- `src/app/roadmap/page.tsx` — page wrapper
- `src/components/Roadmap.tsx` — main roadmap component
- `src/components/Navbar.tsx` — add [ROADMAP] link
