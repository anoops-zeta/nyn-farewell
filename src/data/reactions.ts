import type { MessageReaction } from "@/types";

export type NormalizedReaction = {
  emoji: string;
  by: string[];
};

/** Merge legacy emoji strings and { emoji, by } entries. */
export function normalizeReactions(reactions?: MessageReaction[]): NormalizedReaction[] {
  if (!reactions?.length) return [];

  const map = new Map<string, string[]>();

  for (const reaction of reactions) {
    if (typeof reaction === "string") {
      const prev = map.get(reaction) ?? [];
      map.set(reaction, [...prev, ""]);
      continue;
    }
    const prev = map.get(reaction.emoji) ?? [];
    map.set(reaction.emoji, [...prev, ...(reaction.by ?? [""])]);
  }

  return [...map.entries()].map(([emoji, by]) => ({ emoji, by }));
}
