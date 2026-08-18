import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Wand2 } from "lucide-react";
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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in a formal, friendly, persuasive or apologetic tone, then edit the draft before sending.",
      },
      { property: "og:title", content: "Smart Email Generator — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "AI-drafted business emails with tone and length control, ready to edit and send.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("formal");
  const [length, setLength] = useState("medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { recipient, subject, purpose, tone, length } });
      setOutput(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell
      title="Smart Email Generator"
      description="Describe what the email needs to achieve and pick a tone. The assistant handles structure, etiquette and phrasing."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={submit} className="panel flex flex-col gap-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Thabo, Operations Manager"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Topic / subject hint</Label>
              <Input
                id="subject"
                placeholder="e.g. Q3 report deadline"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="purpose">What should the email say or achieve?</Label>
            <Textarea
              id="purpose"
              required
              rows={7}
              placeholder="Ask the ops team to move the Q3 report deadline from 21 to 28 August because the data export was delayed. Offer a draft by the 25th."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="apologetic">Apologetic</SelectItem>
                  <SelectItem value="assertive but polite">Assertive but polite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short (under 80 words)">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="detailed (150-220 words)">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading || !purpose.trim()} className="mt-1">
            <Wand2 className="size-4" />
            {loading ? "Drafting…" : "Generate email"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Tip: include names, dates and numbers — the AI will not invent them.
          </p>
        </form>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          filename="email-draft"
          emptyHint="Your drafted email will appear here. You can switch to edit mode and refine it before copying."
        />
      </div>
    </Shell>
  );
}
