import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Loader2, Pencil, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function OutputPanel({
  value,
  onChange,
  loading,
  error,
  emptyHint,
  filename,
}: {
  value: string;
  onChange: (next: string) => void;
  loading: boolean;
  error?: string | null;
  emptyHint: string;
  filename: string;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel flex min-h-[22rem] flex-col p-5" aria-live="polite">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          AI output
        </h2>
        {value && !loading && (
          <div className="flex flex-wrap gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => setEditing((v) => !v)}>
              {editing ? <Eye className="size-4" /> : <Pencil className="size-4" />}
              {editing ? "Preview" : "Edit"}
            </Button>
            <Button variant="ghost" size="sm" onClick={download}>
              <Download className="size-4" />
              Save
            </Button>
            <Button variant="secondary" size="sm" onClick={copy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              Copy
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm">Working on it — drafting your response…</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
          {error}
        </div>
      ) : !value ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-6">
          <p className="max-w-sm text-center text-sm text-muted-foreground">{emptyHint}</p>
        </div>
      ) : editing ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[20rem] flex-1 font-mono text-[13px] leading-relaxed"
        />
      ) : (
        <div className="ai-prose">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      )}

      {value && !loading && (
        <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
          AI-generated draft — check facts, names and dates before sending.
        </p>
      )}
    </section>
  );
}
