# AI-Productivity-Assistant

An AI Workplace Productivity Assistant — a modern, responsive web app that helps professionals automate everyday workplace tasks: writing emails, summarising meetings, planning their day and researching topics, plus an interactive AI chat assistant.

## Project overview

Knowledge workers lose hours every week to repetitive writing and admin: drafting the same kinds of emails, cleaning up meeting notes, deciding what to do first, and skimming long articles. This app puts five focused AI assistants behind one clean dashboard. Each tool ships with a carefully engineered, role-based system prompt, so the user only supplies context — the app handles the prompt engineering, the output structure and the guardrails.

Every AI response is rendered as formatted markdown and is **editable, copyable and downloadable**, because AI output is treated as a first draft, never a final answer.

## Features

1. **Smart Email Generator** — professional emails from a short brief, with tone control (formal, friendly, persuasive, apologetic, assertive but polite) and length control. Output includes a subject line and a complete body.
2. **Meeting Notes Summarizer** — paste raw notes or a transcript and get an executive summary, key decisions with rationale, an action-item table (action / owner / deadline / priority), all dates mentioned, and open risks or questions.
3. **AI Task Planner / Scheduler** — ranks tasks using the Eisenhower matrix (urgency × importance), then builds a time-blocked day or a Mon–Fri weekly plan that respects the available focus hours, including breaks, a buffer block and a delegate/deprioritise list.
4. **AI Research Assistant** — summarises a topic or a pasted article into a briefing note: overview, key points, insights and implications, numbered recommendations, and a "what to verify" checklist so nothing is taken on faith.
5. **AI Chatbot Interface (Nova)** — an interactive workplace assistant. The full conversation history is sent on every turn, so answers can be refined instead of restarted. Includes suggested starter prompts.

Supporting features: dashboard layout with sidebar navigation, fully responsive (mobile drawer nav + desktop sidebar), clear input/output split on every tool, loading and error states with human-readable messages, edit/preview/copy/download for every output, and a Responsible AI disclaimer on every page.

## Responsible AI practices

- System prompts forbid inventing facts, names, numbers, dates or quotes; missing information appears as `[PLACEHOLDER]` instead.
- No legal, medical or financial advice — the assistant defers to qualified professionals.
- The research tool never fabricates citations or statistics and always lists claims to verify.
- Prompts require inclusive, bias-free language and forbid requesting sensitive personal data.
- The AI states its assumptions when a request is ambiguous.
- A persistent disclaimer plus per-output reminders make clear the content is AI-generated.
- No user input is persisted — inputs and outputs live only in the browser session.

## Tools used

- **Lovable** — build environment
- **Lovable AI Gateway** with `google/gemini-3.7-flash` — model access
- **Vercel AI SDK** (`ai`, `@ai-sdk/openai-compatible`) — model calls
- **TanStack Start** (React 19 + TanStack Router) — full-stack framework and server functions
- **Vite 7** — build tooling
- **Tailwind CSS v4** with an oklch semantic design-token system (`src/styles.css`)
- **shadcn/ui** + **Radix UI** + **lucide-react** — UI components and icons
- **react-markdown** — rendering AI responses
- **Zod** — input validation on every server function
- **TypeScript**

## Project structure

```
src/
  routes/
    __root.tsx        root layout, fonts, metadata
    index.tsx         dashboard overview
    email.tsx         Smart Email Generator
    notes.tsx         Meeting Notes Summarizer
    planner.tsx       AI Task Planner
    research.tsx      AI Research Assistant
    chat.tsx          AI Chatbot (Nova)
  components/
    Shell.tsx         dashboard layout + sidebar navigation + disclaimer
    OutputPanel.tsx   editable AI output (preview/edit/copy/download)
    ui/               shadcn/ui components
  lib/
    ai.functions.ts       server functions + all engineered prompts
    ai-run.server.ts      gateway calls + error mapping
    ai-gateway.server.ts  AI provider setup
  styles.css          design system (tokens, typography, markdown styles)
```

## Setup instructions

Requirements: Node.js 20+ and npm (or bun).

```bash
git clone <your-repo-url>
cd AI-Productivity-Assistant
npm install
```

Create a `.env` file in the project root:

```
LOVABLE_API_KEY=your_lovable_ai_gateway_key
```

The key is server-side only and is read inside server functions — it is never exposed to the browser. In Lovable it is provisioned automatically.

Run the app:

```bash
npm run dev      # http://localhost:8080
npm run build    # production build
npm run preview  # preview the production build
```

## Team members

- Liyabona — design, prompt engineering and implementation

## Disclaimer

This application generates AI content that may be inaccurate or incomplete. It does not provide legal, medical or financial advice. Always review and verify outputs before use, and do not enter confidential or personal data.
