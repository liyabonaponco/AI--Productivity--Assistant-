import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, SendHorizonal, Sparkles, RotateCcw } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithAssistant } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat Assistant — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Chat with Nova, an AI workplace assistant that drafts, summarises, prioritises and explains — with full conversation context.",
      },
      { property: "og:title", content: "AI Workplace Chat Assistant — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "An interactive AI assistant for everyday workplace questions and drafting.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const starters = [
  "Help me say no politely to an extra project this week.",
  "Turn these bullet points into a status update for my manager.",
  "What should I prioritise if everything is due Friday?",
  "Explain OKRs to a new team member in simple terms.",
];

function ChatPage() {
  const run = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell
      title="AI Assistant"
      description="Nova keeps the whole conversation in context, so you can refine an answer instead of starting over."
    >
      <div className="panel flex h-[62vh] min-h-[26rem] flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-primary" /> Nova · workplace assistant
          </p>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
              <RotateCcw className="size-4" /> New chat
            </Button>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
          {messages.length === 0 && (
            <div className="mx-auto max-w-md space-y-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Ask anything about your work — drafting, prioritising, summarising or explaining.
              </p>
              <div className="grid gap-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/50 hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-4 py-3 text-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-muted/60 text-foreground",
                )}
              >
                {m.role === "assistant" ? (
                  <div className="ai-prose">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" /> Nova is thinking…
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
              {error}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border px-4 py-3 sm:px-5"
        >
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Message Nova… (Shift + Enter for a new line)"
              className="max-h-32 min-h-11 flex-1 resize-none"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
              <SendHorizonal className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Nova is an AI and can be wrong. Don't share confidential or personal data.
          </p>
        </form>
      </div>
    </Shell>
  );
}
