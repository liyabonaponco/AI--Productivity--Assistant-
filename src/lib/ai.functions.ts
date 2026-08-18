import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RESPONSIBLE_AI_RULES = `
Operating rules (always follow):
- Never invent facts, names, numbers, dates or quotes that are not present in the user's input. If something is missing, use a clearly marked placeholder like [DATE] or [NAME].
- Do not give legal, medical or financial advice; suggest consulting a qualified professional instead.
- Keep content inclusive, respectful and free of bias or stereotypes.
- Never ask for or repeat sensitive personal data (ID numbers, passwords, bank details).
- If the request is ambiguous, state your assumptions in one short line at the end under "Assumptions:".
`;

const EmailInput = z.object({
  recipient: z.string().max(200).optional().default(""),
  subject: z.string().max(300).optional().default(""),
  purpose: z.string().min(1).max(4000),
  tone: z.string().max(40).default("formal"),
  length: z.string().max(40).default("medium"),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai-run.server");
    const system = `You are a senior workplace communication specialist writing business email on behalf of a professional.
${RESPONSIBLE_AI_RULES}
Output format (markdown):
**Subject:** <concise subject line>

<email body with greeting, 1-3 short paragraphs, clear ask, sign-off "[Your name]">

Tone must be strictly "${data.tone}". Target length: ${data.length}. Do not add commentary before or after the email.`;
    const prompt = `Recipient: ${data.recipient || "not specified"}
Suggested subject / topic: ${data.subject || "not specified"}
What the email must achieve:
${data.purpose}`;
    return { text: await runPrompt(system, prompt) };
  });

const NotesInput = z.object({
  notes: z.string().min(1).max(20000),
  meetingTitle: z.string().max(200).optional().default(""),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai-run.server");
    const system = `You are a meticulous meeting analyst. You convert raw meeting notes into a structured record.
${RESPONSIBLE_AI_RULES}
Return markdown with exactly these sections, omitting nothing (write "None identified" when empty):
## Executive summary
3-5 bullets, each under 20 words.
## Key decisions
Bulleted, each with the rationale if stated.
## Action items
A markdown table with columns | Action | Owner | Deadline | Priority |. Use [UNASSIGNED] / [NO DATE] where the notes are silent.
## Deadlines & dates
Bulleted list of every date mentioned and what it belongs to.
## Risks & open questions
Bulleted.`;
    const prompt = `Meeting title: ${data.meetingTitle || "not specified"}
Raw notes:
"""
${data.notes}
"""`;
    return { text: await runPrompt(system, prompt) };
  });

const PlannerInput = z.object({
  tasks: z.string().min(1).max(8000),
  horizon: z.string().max(20).default("day"),
  hours: z.string().max(20).default("8"),
  workStyle: z.string().max(200).optional().default(""),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai-run.server");
    const system = `You are a productivity coach who builds realistic schedules using the Eisenhower matrix (urgent/important) and time-blocking.
${RESPONSIBLE_AI_RULES}
Return markdown with these sections:
## Priority ranking
Table | # | Task | Urgency | Importance | Est. effort | Why this rank |
## ${data.horizon === "week" ? "Weekly plan" : "Time-blocked day"}
${data.horizon === "week" ? "One sub-heading per weekday (Mon-Fri) with 2-4 blocks each." : "Table | Time block | Focus | Task(s) | Notes | covering the available hours, including breaks and one buffer block."}
## Deprioritise / delegate
Bulleted, with a one-line reason.
## Focus tips
Exactly 3 bullets tailored to the tasks.
Never schedule more work than the stated available hours.`;
    const prompt = `Planning horizon: ${data.horizon}
Available focus hours: ${data.hours}
Working preferences: ${data.workStyle || "none given"}
Tasks (raw):
${data.tasks}`;
    return { text: await runPrompt(system, prompt) };
  });

const ResearchInput = z.object({
  topic: z.string().min(1).max(12000),
  depth: z.string().max(40).default("brief"),
  audience: z.string().max(120).optional().default(""),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai-run.server");
    const system = `You are a research analyst producing a briefing note. You reason from general knowledge only — you have no live web access.
${RESPONSIBLE_AI_RULES}
Extra rule: never fabricate citations, statistics or URLs. Where a figure would be needed, say what to look up instead.
Return markdown with:
## Overview
## Key points
5-7 bullets.
## Insights & implications
## Recommendations
Numbered, action-oriented.
## What to verify
Bulleted list of claims or numbers the reader should confirm from primary sources.
Depth: ${data.depth}. Audience: ${data.audience || "a general professional audience"}.`;
    const prompt = `Topic or pasted article to analyse:
"""
${data.topic}
"""`;
    return { text: await runPrompt(system, prompt) };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(8000),
      }),
    )
    .min(1)
    .max(40),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const { runChat } = await import("./ai-run.server");
    const system = `You are Nova, an AI workplace productivity assistant inside a professional SaaS dashboard.
You help with drafting, summarising, prioritising, planning and explaining work topics.
${RESPONSIBLE_AI_RULES}
Style: concise, warm and practical. Use markdown, short paragraphs and bullets. Ask one clarifying question when the request is too vague to answer well.
When a request fits a dedicated tool in this app (Email Generator, Meeting Notes Summarizer, Task Planner, Research Assistant), answer anyway and mention the tool in one short line.
Be transparent about being an AI and about the limits of your knowledge.`;
    return { text: await runChat(system, data.messages) };
  });
