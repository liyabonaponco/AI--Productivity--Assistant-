import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  NotebookPen,
  CalendarClock,
  Telescope,
  MessagesSquare,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Productivity Assistant — Workplace AI Dashboard" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarize meeting notes, plan your day, research topics and chat with an AI assistant.",
      },
      { property: "og:title", content: "AI Productivity Assistant — Workplace AI Dashboard" },
      {
        property: "og:description",
        content:
          "Five AI tools for professionals: email generator, meeting summarizer, task planner, research assistant and chat assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Professional emails in a formal, friendly, persuasive or apologetic tone — ready to edit and send.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Turn messy notes into a summary with decisions, an action-item table, deadlines and open risks.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "AI Task Planner",
    body: "Prioritise with the Eisenhower matrix and get a realistic time-blocked day or weekly plan.",
  },
  {
    to: "/research",
    icon: Telescope,
    title: "AI Research Assistant",
    body: "Summarize topics or pasted articles into briefing notes with insights and recommendations.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Chatbot Assistant",
    body: "Ask Nova anything about your work — it keeps the full conversation in context.",
  },
] as const;

function Dashboard() {
  return (
    <Shell
      title="Your AI workplace command centre"
      description="Five focused assistants that take the busywork out of writing, summarising, planning and researching. Every output is editable before you use it."
      key="dashboard"
    >
      <div className="space-y-6">
        <div className="panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-accent/25 px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              <Zap className="size-3.5" /> Powered by Lovable AI
            </p>
            <h2 className="mt-3 text-xl font-semibold">Start with the task at hand</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Each tool uses a structured, role-based prompt behind the scenes, so you only supply the
              context — not the prompt engineering.
            </p>
          </div>
          <Link
            to="/chat"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open AI assistant <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map(({ to, icon: Icon, title, body }) => (
            <Link
              key={to}
              to={to}
              className="panel group flex flex-col gap-3 p-5 transition-colors hover:border-primary/50"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open tool
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="panel p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <ShieldCheck className="size-4.5 text-primary" /> How we use AI responsibly
          </h3>
          <ul className="mt-3 grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
            <li>Prompts instruct the model never to invent facts — gaps appear as [PLACEHOLDER].</li>
            <li>Every output is editable, copyable and downloadable before you act on it.</li>
            <li>No legal, medical or financial advice is generated.</li>
            <li>Nothing you type is stored — inputs live only in your browser session.</li>
          </ul>
        </div>
      </div>
    </Shell>
  );
}
