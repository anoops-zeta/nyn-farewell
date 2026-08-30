import type { MessageNode, SavedReply, ThreadNode, UnlockNode } from "@/types";

export type RenderGroup = {
  type: "group";
  from: MessageNode["from"];
  sender?: string;
  time: string;
  messages: MessageNode[];
};

function senderKey(node: MessageNode): string {
  if (node.from === "nyn") return "nyn";
  return node.sender ?? "";
}

export type RenderItem =
  | { type: "date"; value: string }
  | { type: "lastRead" }
  | { type: "system"; value: string }
  | { type: "unlock"; suggestions: string[] }
  | RenderGroup;

export function toRenderItems(thread: ThreadNode[]): RenderItem[] {
  const out: RenderItem[] = [];
  let group: RenderGroup | null = null;

  const flush = () => {
    if (group) {
      out.push(group);
      group = null;
    }
  };

  for (const node of thread) {
    if (node.type === "message") {
      if (group && senderKey(group.messages[0]) === senderKey(node)) {
        group.messages.push(node);
      } else {
        flush();
        group = {
          type: "group",
          from: node.from,
          sender: node.sender,
          time: node.time,
          messages: [node],
        };
      }
      continue;
    }
    flush();
    if (node.type === "date") out.push({ type: "date", value: node.value });
    else if (node.type === "lastRead") out.push({ type: "lastRead" });
    else if (node.type === "system") out.push({ type: "system", value: node.value });
    else if (node.type === "unlock") out.push({ type: "unlock", suggestions: node.suggestions });
  }
  flush();
  return out;
}

export function replyToMessage(reply: SavedReply): MessageNode {
  return {
    type: "message",
    from: "nyn",
    time: reply.time,
    blocks: [{ kind: "text", value: reply.text }],
  };
}

export function mergeThread(thread: ThreadNode[], replies: SavedReply[] = []): ThreadNode[] {
  return [...thread, ...replies.map(replyToMessage)];
}

export function playableNodes(thread: ThreadNode[], _gatesPassed: number, replies: SavedReply[] = []): ThreadNode[] {
  return mergeThread(thread, replies).filter((node) => node.type !== "unlock");
}

export function nextUnlock(thread: ThreadNode[], gatesPassed: number): UnlockNode | undefined {
  let i = 0;
  for (const node of thread) {
    if (node.type !== "unlock") continue;
    if (i === gatesPassed) return node;
    i += 1;
  }
}

export function formatClock(date = new Date()): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function typingDelayMs(node: ThreadNode): number {
  if (node.type !== "message") return 90;
  if (node.from !== "them") return 280;
  const text = node.blocks
    .filter((b): b is Extract<typeof b, { kind: "text" }> => b.kind === "text")
    .map((b) => b.value)
    .join(" ");
  return Math.min(1100, Math.max(600, 600 + Math.round(text.length * 1.2)));
}

function plainText(value: string): string {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

function blockPreview(block: MessageNode["blocks"][number]): string | null {
  switch (block.kind) {
    case "text":
      return plainText(block.value);
    case "image":
      return block.caption ? plainText(block.caption) : "Photo";
    case "video":
      return "Video message";
    case "file":
      return block.name;
    case "link":
      return block.title;
    case "list":
      return block.items[0] ?? "List";
    case "quote":
      return plainText(block.value);
    case "card":
      return plainText(block.title);
    default:
      return null;
  }
}

function messageBodyPreview(node: MessageNode): string {
  for (const block of node.blocks) {
    const text = blockPreview(block);
    if (text) return text;
  }
  return "Message";
}

/** One-line sidebar preview for the latest message in a thread. */
export function lastMessageSnippet(
  thread: ThreadNode[],
  replies: SavedReply[] = [],
  kind: "person" | "group" = "person",
): string {
  const merged = mergeThread(thread, replies);
  for (let i = merged.length - 1; i >= 0; i--) {
    const node = merged[i];
    if (node.type !== "message") continue;

    const body = messageBodyPreview(node);
    if (node.from === "nyn") return `You: ${body}`;
    if (kind === "group" && node.sender) {
      const first = node.sender.split(/\s+/)[0];
      return `${first}: ${body}`;
    }
    return body;
  }
  return "";
}
