import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CalendarClock } from "lucide-react";
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
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Turn a messy task list into a prioritised, time-blocked daily or weekly schedule using the Eisenhower matrix.",
      },
      { property: "og:title", content: "AI Task Planner — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Prioritise tasks and get a realistic time-blocked day or week plan.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("day");
  const [hours, setHours] = useState("8");
  const [workStyle, setWorkStyle] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasks.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { tasks, horizon, hours, workStyle } });
      setOutput(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell
      title="AI Task Planner"
      description="List everything on your plate. The planner ranks by urgency and importance, then builds a schedule that fits the hours you actually have."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={submit} className="panel flex flex-col gap-4 p-5">
          <div className="space-y-1.5">
            <Label htmlFor="tasks">Tasks, deadlines and commitments</Label>
            <Textarea
              id="tasks"
              required
              rows={10}
              placeholder={"Finish Q3 report (due Thursday)\nInterview 2 candidates\nReply to supplier emails\nPrep board deck\nGym"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Plan for</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hours">Available focus hours</Label>
              <Input
                id="hours"
                inputMode="numeric"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="style">Working preferences (optional)</Label>
            <Input
              id="style"
              placeholder="Deep work in the mornings, no meetings after 16:00"
              value={workStyle}
              onChange={(e) => setWorkStyle(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading || !tasks.trim()}>
            <CalendarClock className="size-4" />
            {loading ? "Planning…" : "Build my plan"}
          </Button>
        </form>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          filename="my-plan"
          emptyHint="Your prioritised ranking and time-blocked schedule will appear here."
        />
      </div>
    </Shell>
  );
}
