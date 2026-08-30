import { config } from "@/data";
import type { ChatProgress, PersistState } from "@/types";

export function persistKey(version = config.schemaVersion) {
  return `nyn-chat:v${version}`;
}

export function emptyProgress(unread = true): ChatProgress {
  return {
    unread,
    gatesPassed: 0,
    revealed: 0,
    replies: [],
    reactions: {},
  };
}

export function emptyPersist(version = config.schemaVersion): PersistState {
  return { schemaVersion: version, chats: {} };
}

function isProgress(value: unknown): value is ChatProgress {
  if (!value || typeof value !== "object") return false;
  const v = value as ChatProgress;
  return (
    typeof v.unread === "boolean" &&
    typeof v.gatesPassed === "number" &&
    typeof v.revealed === "number" &&
    Array.isArray(v.replies) &&
    typeof v.reactions === "object" &&
    v.reactions !== null
  );
}

export function clearPersist() {
  if (typeof window === "undefined") return;
  for (let version = 1; version <= config.schemaVersion; version += 1) {
    window.localStorage.removeItem(persistKey(version));
  }
}

export function loadPersist(): PersistState {
  if (typeof window === "undefined") return emptyPersist();
  try {
    const raw = window.localStorage.getItem(persistKey());
    if (!raw) return emptyPersist();
    const parsed = JSON.parse(raw) as PersistState;
    if (parsed.schemaVersion !== config.schemaVersion || !parsed.chats) {
      clearPersist();
      return emptyPersist();
    }
    const chats: Record<string, ChatProgress> = {};
    for (const [id, chat] of Object.entries(parsed.chats)) {
      if (isProgress(chat)) {
        const { unread: _unread, ...rest } = chat;
        chats[id] = { ...rest, unread: false };
      }
    }
    return { schemaVersion: config.schemaVersion, chats };
  } catch {
    return emptyPersist();
  }
}

export function savePersist(state: PersistState) {
  if (typeof window === "undefined") return;
  const chats = Object.fromEntries(
    Object.entries(state.chats).map(([id, chat]) => {
      const { unread: _unread, ...rest } = chat;
      return [id, { ...rest, unread: false }];
    }),
  );
  window.localStorage.setItem(persistKey(), JSON.stringify({ ...state, chats }));
}
