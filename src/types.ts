export type Presence = "available" | "away" | "busy" | "offline" | "ooo";
export type PersonKind = "person" | "group";
export type InitialsColor = "pink" | "green" | "yellow" | "blue" | "red" | "purple";
export type Section = "favourites" | "chats";

export type TextBlock = { kind: "text"; value: string };
export type ListBlock = { kind: "list"; items: string[] };
export type ImageBlock = { kind: "image"; src: string; caption?: string };
export type VideoBlock = {
  kind: "video";
  src: string;
  poster?: string;
  placeholder?: boolean;
  embedUrl?: string;
  transcript?: string;
};
export type FileApp = "powerpoint" | "word" | "excel" | "pdf" | "generic";

export type FileBlock = {
  kind: "file";
  name: string;
  app: FileApp;
  path: string;
  preview?: string;
};
export type LinkBlock = {
  kind: "link";
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
};
export type QuoteBlock = {
  kind: "quote";
  author: string;
  time: string;
  value: string;
};
export type CardBlock = {
  kind: "card";
  title: string;
  body: string;
  footnote?: string;
};

export type MessageBlock =
  | TextBlock
  | ListBlock
  | ImageBlock
  | VideoBlock
  | FileBlock
  | LinkBlock
  | QuoteBlock
  | CardBlock;

export type MessageReaction = string | { emoji: string; by?: string[] };

export type MessageNode = {
  type: "message";
  from: "them" | "nyn";
  time: string;
  /** Named speaker in a group thread. Falls back to the chat name. */
  sender?: string;
  senderColor?: InitialsColor;
  blocks: MessageBlock[];
  reactions?: MessageReaction[];
  mentionsNyn?: boolean;
};

export type UnlockNode = { type: "unlock"; suggestions: string[] };
export type DateNode = { type: "date"; value: string };
export type LastReadNode = { type: "lastRead" };
export type SystemNode = { type: "system"; value: string };

export type ThreadNode = MessageNode | UnlockNode | DateNode | LastReadNode | SystemNode;

export type PinnedMessage = {
  author: string;
  text: string;
  date: string;
};

export type Person = {
  id: string;
  name: string;
  title: string | null;
  avatar?: string | null;
  initialsColor: InitialsColor;
  kind: PersonKind;
  presence: Presence | null;
  section: Section;
  order: number;
  unread: boolean;
  pinnedMessage?: PinnedMessage | null;
  notice?: string | null;
  thread: ThreadNode[];
};

export type CopilotRule = {
  _comment?: string;
  patterns: string[];
  response: string;
};

export type EasterEggs = {
  nynPresenceAway: boolean;
  updateGag: boolean;
  recapTab: boolean;
  meetNow: boolean;
  unsend: boolean;
  farewellTab: boolean;
  lockedChannel: boolean;
  gagFiles: boolean;
  idlePrompt: boolean;
  toasts: boolean;
  konami: boolean;
};

export type AppConfig = {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  themeColor: string;
  nyn: {
    id: string;
    name: string;
    displayName: string;
    title: string;
    avatar: string | null;
    initials: string;
    initialsColor: InitialsColor;
    presence: Presence;
    status: string;
    links: { website: string; linkedin: string };
  };
  tenant: {
    name: string;
    shortName: string;
  };
  studio: {
    id: string;
    name: string;
    initialsColor: InitialsColor;
  };
  gate: {
    enabled: boolean;
    password: string;
  };
  presentation: {
    scale: number;
  };
  copilot: {
    rules: CopilotRule[];
    defaultResponse: string;
    suggestions?: string[];
    moreSuggestions?: string[];
  };
  easterEggs: EasterEggs;
  emptyCopy: {
    mentions: string;
    tagMentions?: string;
    drafts: string;
    discover?: string;
    notes: string;
    notesBody?: string;
    sharedEmpty?: string;
  };
  schemaVersion: number;
  copy?: {
    recap?: {
      header: string;
      subheader: string;
      footnote: string;
      template: string;
      themesFallback: string;
      overrides?: Record<string, string>;
    };
    search?: {
      selfSearchBanner: string;
      noResults: string;
    };
    presenceCard?: {
      status: string;
      localTime: string;
      outOfOfficeNote: string;
    };
    updateGag?: string;
    unsend?: string;
    idlePrompts?: string[];
    toasts?: string[];
    farewellTab?: { label: string; closeTooltip: string };
    farewellPane?: { heading: string; body: string; signoff: string };
    notFound?: { title: string; body: string; action: string };
  };
};

export type ChatFilter = "all" | "unread" | "channels" | "chats";

export type SavedReply = {
  id: string;
  /** Index of the unlock this reply passed, or -1 if sent after the thread was fully open. */
  gate: number;
  time: string;
  text: string;
};

export type ChatProgress = {
  unread: boolean;
  gatesPassed: number;
  revealed: number;
  replies: SavedReply[];
  reactions: Record<string, string[]>;
};

export type PersistState = {
  schemaVersion: number;
  chats: Record<string, ChatProgress>;
};

export type SharedItem = {
  personId: string;
  messageIndex: number;
  block: ImageBlock | VideoBlock | FileBlock;
};
