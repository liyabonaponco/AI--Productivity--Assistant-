import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Telescope } from "lucide-react";
import { Shell } from "@/components/Shell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Summarize a topic or pasted article into a briefing note with key points, insights, recommendations and claims to verify.",
      },
      { property: "og:title", content: "AI Research Assistant — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Briefing notes with insights, recommendations and a verification checklist.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("brief");
  const [audience, setAudience] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { topic, depth, audience } });
      setOutput(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell
      title="AI Research Assistant"
      description="Enter a topic or paste an article. You get a structured briefing note — plus an honest list of what still needs verifying from primary sources."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={submit} className="panel flex flex-col gap-4 p-5">
          <div className="space-y-1.5">
            <Label htmlFor="topic">Topic or article text</Label>
            <Textarea
              id="topic"
              required
              rows={12}
              placeholder="e.g. How should mid-size retailers approach AI-assisted demand forecasting? — or paste an article to summarize."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Quick brief</SelectItem>
                  <SelectItem value="standard briefing">Standard briefing</SelectItem>
                  <SelectItem value="deep analysis">Deep analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="audience">Audience (optional)</Label>
              <Input
                id="audience"
                placeholder="Exec team, students, clients…"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading || !topic.trim()}>
            <Telescope className="size-4" />
            {loading ? "Researching…" : "Research topic"}
          </Button>
          <p className="text-xs text-muted-foreground">
            No live web access: the assistant reasons from general knowledge and flags what to confirm.
          </p>
        </form>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          filename="research-brief"
          emptyHint="Your briefing note — overview, key points, insights, recommendations — will appear here."
        />
      </div>
    </Shell>
  );
}
