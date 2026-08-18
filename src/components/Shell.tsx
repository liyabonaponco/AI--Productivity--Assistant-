import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  CalendarClock,
  Telescope,
  MessagesSquare,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: Telescope },
  { to: "/chat", label: "AI Assistant", icon: MessagesSquare },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Sparkles className="size-4.5" />
      </span>
      <span className="leading-tight">
        <span className="block text-display text-sm font-semibold text-sidebar-foreground">
          AI Productivity Assistant
        </span>
        <span className="block text-xs text-sidebar-foreground/60">Workplace automation suite</span>
      </span>
    </div>
  );
}

export function Shell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden bg-sidebar p-5 lg:flex lg:flex-col lg:gap-8">
        <Brand />
        <NavLinks />
        <div className="mt-auto rounded-lg border border-sidebar-border bg-sidebar-accent p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-sidebar-accent-foreground">
            <ShieldCheck className="size-3.5" /> Responsible AI
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-sidebar-foreground/70">
            Outputs are AI-generated drafts. Review facts, names and dates before you send or act.
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-sidebar px-4 py-3 lg:hidden">
          <Brand />
          <button
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </header>
        {open && (
          <div className="border-b border-sidebar-border bg-sidebar px-4 pb-4 lg:hidden">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        )}

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
              <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </main>

        <footer className="border-t border-border px-4 py-5 sm:px-6 lg:px-10">
          <p className="mx-auto max-w-5xl text-xs leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Responsible AI disclaimer:</strong> This
            assistant produces AI-generated content that can be incomplete or inaccurate. It does not
            provide legal, medical or financial advice. Always review, edit and verify outputs before
            using them, and never enter confidential personal data, credentials or client information.
          </p>
        </footer>
      </div>
    </div>
  );
}
