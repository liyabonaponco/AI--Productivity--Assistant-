import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListChecks } from "lucide-react";
import { Shell } from "@/components/Shell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Summarize long meeting notes into an executive summary plus decisions, owners, deadlines and action items.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Turn raw meeting notes into decisions, action items with owners, and deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const run = useServerFn(summarizeMeeting);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { notes, meetingTitle } });
      setOutput(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell
      title="Meeting Notes Summarizer"
      description="Paste raw notes or a transcript. You get an executive summary, the decisions taken, an action-item table with owners and deadlines, and open risks."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={submit} className="panel flex flex-col gap-4 p-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Meeting title (optional)</Label>
            <Input
              id="title"
              placeholder="e.g. Weekly product sync — 18 Aug"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Raw notes or transcript</Label>
            <Textarea
              id="notes"
              required
              rows={16}
              placeholder="Paste your notes here — bullet points, half sentences and typos are fine."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {notes.trim() ? `${notes.trim().split(/\s+/).length} words` : "No notes yet"} · remove
              confidential details before pasting.
            </p>
          </div>
          <Button type="submit" disabled={loading || !notes.trim()}>
            <ListChecks className="size-4" />
            {loading ? "Summarizing…" : "Summarize notes"}
          </Button>
        </form>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          filename="meeting-summary"
          emptyHint="Your structured summary — decisions, action items, deadlines and risks — will appear here."
        />
      </div>
    </Shell>
  );
}
