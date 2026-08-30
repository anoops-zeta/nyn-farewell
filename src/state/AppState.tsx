import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  allPeople,
  chatPeople as loadChats,
  config,
  favouritePeople as loadFavourites,
  getPerson,
  matchesFilter,
  people,
} from "@/data";
import { formatClock, nextUnlock, playableNodes } from "@/data/thread";
import { emptyProgress, loadPersist, savePersist } from "@/state/persist";
import type { AppConfig, ChatFilter, ChatProgress, PersistState, Person, SavedReply } from "@/types";

export type AppView =
  | { kind: "chat"; id: string }
  | { kind: "copilot" }
  | { kind: "mentions" }
  | { kind: "drafts" }
  | { kind: "teams" };

export type ChatTab = "chat" | "shared" | "notes" | "recap";

type State = {
  view: AppView;
  tab: ChatTab;
  compose: string;
  updateOpen: boolean;
  sidebarOpen: boolean;
  mobileShowList: boolean;
  chatFilter: ChatFilter;
  persist: PersistState;
  readInSession: Record<string, true>;
  sections: {
    quickViews: boolean;
    favourites: boolean;
    chats: boolean;
  };
};

type Action =
  | { type: "navigate"; view: AppView }
  | { type: "setTab"; tab: ChatTab }
  | { type: "setCompose"; value: string }
  | { type: "toggleSection"; section: keyof State["sections"] }
  | { type: "toggleUpdate" }
  | { type: "closeUpdate" }
  | { type: "toggleSidebar" }
  | { type: "showMobileList" }
  | { type: "setChatFilter"; filter: ChatFilter }
  | { type: "setChatProgress"; personId: string; patch: Partial<ChatProgress> }
  | { type: "send"; personId: string; text: string }
  | { type: "markChatRead"; personId: string }
  | { type: "markAllUnread" };

function viewToHash(view: AppView): string {
  if (view.kind === "chat") return `#/chat/${view.id}`;
  return `#/${view.kind}`;
}

function hashToView(hash: string): AppView {
  const raw = hash.replace(/^#/, "").replace(/^\//, "");
  const [head, id] = raw.split("/");
  if (head === "chat" && id) return { kind: "chat", id };
  if (head === "copilot") return { kind: "copilot" };
  if (head === "mentions") return { kind: "mentions" };
  if (head === "drafts") return { kind: "drafts" };
  if (head === "teams") return { kind: "teams" };
  const first = [...people].sort((a, b) => a.order - b.order)[0];
  return first ? { kind: "chat", id: first.id } : { kind: "copilot" };
}

function progressOf(state: State, personId: string): ChatProgress {
  return state.persist.chats[personId] ?? emptyProgress(false);
}

function writeChat(state: State, personId: string, chat: ChatProgress): State {
  return {
    ...state,
    persist: {
      ...state.persist,
      chats: { ...state.persist.chats, [personId]: chat },
    },
  };
}

function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

const bootView = hashToView(typeof window === "undefined" ? "" : window.location.hash);

const initial: State = {
  view: bootView,
  tab: "chat",
  compose: "",
  updateOpen: false,
  sidebarOpen: true,
  mobileShowList:
    typeof window === "undefined"
      ? true
      : isMobileViewport() ||
        !/#\/(chat|copilot|mentions|drafts|teams)/.test(window.location.hash),
  chatFilter: "all",
  persist: loadPersist(),
  readInSession: bootView.kind === "chat" ? { [bootView.id]: true } : {},
  sections: { quickViews: true, favourites: true, chats: true },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "navigate": {
      const next = {
        ...state,
        view: action.view,
        tab: "chat" as const,
        compose: "",
        updateOpen: false,
        mobileShowList: false,
      };
      if (action.view.kind === "chat") {
        return {
          ...next,
          readInSession: { ...next.readInSession, [action.view.id]: true as const },
        };
      }
      return next;
    }
    case "setTab":
      return { ...state, tab: action.tab };
    case "setCompose":
      return { ...state, compose: action.value };
    case "toggleSection":
      return { ...state, sections: { ...state.sections, [action.section]: !state.sections[action.section] } };
    case "toggleUpdate":
      return { ...state, updateOpen: !state.updateOpen };
    case "closeUpdate":
      return { ...state, updateOpen: false };
    case "toggleSidebar":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "showMobileList":
      return { ...state, mobileShowList: true };
    case "setChatFilter":
      return {
        ...state,
        chatFilter: state.chatFilter === action.filter ? "all" : action.filter,
      };
    case "setChatProgress": {
      const { unread, ...rest } = action.patch;
      let next = state;
      if (unread === false) {
        next = {
          ...next,
          readInSession: { ...next.readInSession, [action.personId]: true },
        };
      }
      if (Object.keys(rest).length === 0) return next;
      const prev = progressOf(next, action.personId);
      return writeChat(next, action.personId, { ...prev, ...rest });
    }
    case "markChatRead":
      return {
        ...state,
        readInSession: { ...state.readInSession, [action.personId]: true },
      };
    case "send": {
      const text = action.text.trim();
      if (!text) return state;
      const person = getPerson(action.personId);
      if (!person) return { ...state, compose: "" };
      const prev = progressOf(state, action.personId);
      const pending = nextUnlock(person.thread, prev.gatesPassed);
      const reply: SavedReply = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `r-${Date.now()}`,
        gate: pending ? prev.gatesPassed : -1,
        time: formatClock(),
        text,
      };
      const gatesPassed = pending ? prev.gatesPassed + 1 : prev.gatesPassed;
      const replies = [...prev.replies, reply];
      const nextPlayable = playableNodes(person.thread, gatesPassed, replies);
      return writeChat(
        {
          ...state,
          compose: "",
          readInSession: { ...state.readInSession, [action.personId]: true },
        },
        action.personId,
        {
          ...prev,
          replies,
          gatesPassed,
          revealed: nextPlayable.length,
        },
      );
    }
    case "markAllUnread": {
      const chats = { ...state.persist.chats };
      for (const person of people) {
        const prev = chats[person.id] ?? emptyProgress(false);
        chats[person.id] = { ...prev, revealed: 0 };
      }
      return { ...state, readInSession: {}, persist: { ...state.persist, chats } };
    }
    default:
      return state;
  }
}

function overlayUnread(person: Person, readInSession: Record<string, true>): Person {
  return {
    ...person,
    unread: readInSession[person.id] ? false : person.unread,
  };
}

type Store = State & {
  people: Person[];
  config: AppConfig;
  selectedPerson: Person | null;
  favouritePeople: Person[];
  chatPeople: Person[];
  selectedProgress: ChatProgress | null;
  playable: ReturnType<typeof playableNodes>;
  playbackIdle: boolean;
  pendingUnlock: ReturnType<typeof nextUnlock>;
  navigate: (view: AppView) => void;
  setTab: (tab: ChatTab) => void;
  setCompose: (value: string) => void;
  toggleSection: (section: keyof State["sections"]) => void;
  toggleUpdate: () => void;
  closeUpdate: () => void;
  toggleSidebar: () => void;
  showMobileList: () => void;
  setChatFilter: (filter: ChatFilter) => void;
  setChatProgress: (personId: string, patch: Partial<ChatProgress>) => void;
  sendReply: (text: string) => void;
  markChatRead: (personId: string) => void;
  markAllUnread: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    const next = viewToHash(state.view);
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [state.view]);

  useEffect(() => {
    const onHash = () => dispatch({ type: "navigate", view: hashToView(window.location.hash) });
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    savePersist(state.persist);
  }, [state.persist]);

  const favouritePeople = loadFavourites().filter((p) =>
    matchesFilter(overlayUnread(p, state.readInSession), state.chatFilter),
  );

  const chatPeople = loadChats().filter((p) =>
    matchesFilter(overlayUnread(p, state.readInSession), state.chatFilter),
  );

  const selectedPerson = useMemo(() => {
    if (state.view.kind !== "chat") return null;
    const person = getPerson(state.view.id);
    return person ? overlayUnread(person, state.readInSession) : null;
  }, [state.view, state.readInSession]);

  const selectedProgress = useMemo(() => {
    if (!selectedPerson) return null;
    return progressOf(state, selectedPerson.id);
  }, [selectedPerson, state.persist]);

  const playable = useMemo(() => {
    if (!selectedPerson || !selectedProgress) return [];
    return playableNodes(selectedPerson.thread, selectedProgress.gatesPassed, selectedProgress.replies);
  }, [selectedPerson, selectedProgress]);

  const playbackIdle = selectedProgress ? selectedProgress.revealed >= playable.length : true;

  const pendingUnlock = useMemo(() => {
    if (!selectedPerson || !selectedProgress) return undefined;
    return nextUnlock(selectedPerson.thread, selectedProgress.gatesPassed);
  }, [selectedPerson, selectedProgress]);

  const navigate = useCallback((view: AppView) => dispatch({ type: "navigate", view }), []);
  const setTab = useCallback((tab: ChatTab) => dispatch({ type: "setTab", tab }), []);
  const setCompose = useCallback((value: string) => dispatch({ type: "setCompose", value }), []);
  const toggleSection = useCallback(
    (section: keyof State["sections"]) => dispatch({ type: "toggleSection", section }),
    [],
  );
  const toggleUpdate = useCallback(() => dispatch({ type: "toggleUpdate" }), []);
  const closeUpdate = useCallback(() => dispatch({ type: "closeUpdate" }), []);
  const toggleSidebar = useCallback(() => dispatch({ type: "toggleSidebar" }), []);
  const showMobileList = useCallback(() => dispatch({ type: "showMobileList" }), []);
  const setChatFilter = useCallback((filter: ChatFilter) => dispatch({ type: "setChatFilter", filter }), []);
  const setChatProgress = useCallback(
    (personId: string, patch: Partial<ChatProgress>) => dispatch({ type: "setChatProgress", personId, patch }),
    [],
  );
  const chatId = state.view.kind === "chat" ? state.view.id : null;
  const sendReply = useCallback(
    (text: string) => {
      if (!chatId) return;
      dispatch({ type: "send", personId: chatId, text });
    },
    [chatId],
  );
  const markChatRead = useCallback(
    (personId: string) => dispatch({ type: "markChatRead", personId }),
    [],
  );
  const markAllUnread = useCallback(() => dispatch({ type: "markAllUnread" }), []);

  const value: Store = {
    ...state,
    people: allPeople().map((p) => overlayUnread(p, state.readInSession)),
    config,
    selectedPerson,
    favouritePeople,
    chatPeople,
    selectedProgress,
    playable,
    playbackIdle,
    pendingUnlock,
    navigate,
    setTab,
    setCompose,
    toggleSection,
    toggleUpdate,
    closeUpdate,
    toggleSidebar,
    showMobileList,
    setChatFilter,
    setChatProgress,
    markChatRead,
    sendReply,
    markAllUnread,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
