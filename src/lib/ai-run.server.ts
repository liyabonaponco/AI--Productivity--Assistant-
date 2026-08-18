import { streamText, type ModelMessage } from "ai";
import { getModel } from "./ai-gateway.server";

function friendly(error: unknown): never {
  const err = error as { statusCode?: number; message?: string };
  const status = err?.statusCode;
  if (status === 429) throw new Error("The AI service is busy right now. Please try again in a moment.");
  if (status === 402) throw new Error("AI credits are exhausted for this workspace. Add credits in Lovable to continue.");
  if (status === 403) throw new Error("AI access is blocked by workspace policy. Contact the workspace admin.");
  throw new Error(err?.message || "The AI request failed. Please try again.");
}

export async function runPrompt(system: string, prompt: string) {
  try {
    const result = streamText({ model: getModel(), system, prompt });
    return await result.text;
  } catch (error) {
    friendly(error);
  }
}

export async function runChat(
  system: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
) {
  try {
    const result = streamText({
      model: getModel(),
      system,
      messages: messages as ModelMessage[],
    });
    return await result.text;
  } catch (error) {
    friendly(error);
  }
}
