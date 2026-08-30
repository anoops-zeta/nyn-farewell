import { Avatar } from "@/components/Avatar";
import { lastMessageSnippet } from "@/data/thread";
import {
  IconChevronDown,
  IconDrafts,
  IconMention,
  IconMore,
  IconSearch,
  IconSparkle,
} from "@/icons";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useAppStore, type AppView } from "@/state/AppState";
import type { Person } from "@/types";
import { useMemo, useState, type ReactNode } from "react";

const sidebarRowBase =
  "mx-1.5 w-[calc(100%-12px)] rounded-md border border-solid px-2 text-left transition-colors";
const sidebarRowSelected =
  "border-[var(--row-selected-border)] bg-[var(--row-selected-subtle)]";
const sidebarRowIdle = "border-transparent hover:bg-row-hover";

function SectionHeader({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-8 w-full items-center gap-1 px-4 text-left text-section text-text-secondary hover:text-text-primary"
    >
      <IconChevronDown
        size={12}
        className={`shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
      />
      <span>{label}</span>
    </button>
  );
}

function ChatRow({
  person,
  selected,
  readInSession,
  onSelect,
}: {
  person: Person;
  selected: boolean;
  readInSession: Record<string, true>;
  onSelect: () => void;
}) {
  const isMobile = useIsMobile();
  const { persist } = useAppStore();
  const [hover, setHover] = useState(false);
  const unread = readInSession[person.id] ? false : person.unread;
  const avatarSize = isMobile ? 32 : 24;
  const snippet = useMemo(
    () => lastMessageSnippet(person.thread, persist.chats[person.id]?.replies ?? [], person.kind),
    [person.thread, person.kind, person.id, persist.chats],
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group flex items-center gap-3 md:gap-2 ${sidebarRowBase} ${
        isMobile ? "h-[58px]" : "h-[40px]"
      } ${selected ? sidebarRowSelected : sidebarRowIdle}`}
    >
      <Avatar
        name={person.name}
        src={person.avatar}
        initialsColor={person.initialsColor}
        kind={person.kind}
        presence={person.presence}
        size={avatarSize}
      />
      <span className="min-w-0 flex-1 text-left">
        <span
          className={`block truncate text-row-name leading-tight ${
            selected
              ? "font-normal text-white"
              : unread
                ? "font-semibold text-white"
                : "font-normal text-[#d1d1d1]"
          }`}
        >
          {person.name}
        </span>
        {isMobile && snippet ? (
          <span
            className={`mt-0.5 block truncate text-[13px] leading-tight ${
              unread ? "font-medium text-[#b8b8b8]" : "font-normal text-text-secondary"
            }`}
          >
            {snippet}
          </span>
        ) : null}
      </span>
      {!isMobile && (hover || selected) && (
        <span className="flex h-6 w-6 items-center justify-center rounded text-text-secondary hover:bg-white/10">
          <IconMore size={16} />
        </span>
      )}
    </button>
  );
}

function NavRow({
  icon,
  label,
  selected,
  onSelect,
}: {
  icon: ReactNode;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex h-[34px] items-center gap-2 ${sidebarRowBase} text-row-name ${
        selected ? `${sidebarRowSelected} text-white` : `${sidebarRowIdle} text-[#d1d1d1]`
      }`}
    >
      <span className="flex h-7 w-7 items-center justify-center text-text-secondary">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

export function Sidebar() {
  const {
    view,
    navigate,
    sections,
    toggleSection,
    favouritePeople,
    chatPeople,
    chatFilter,
    setChatFilter,
    readInSession,
  } = useAppStore();

  const is = (next: AppView) =>
    view.kind === next.kind && (next.kind !== "chat" || (view.kind === "chat" && view.id === next.id));

  const filterActive = chatFilter !== "all";
  const showFavourites = !filterActive || favouritePeople.length > 0;
  const showChats = !filterActive || chatPeople.length > 0;
  const showChatSections = showFavourites || showChats;

  const openChat = (personId: string) => {
    navigate({ kind: "chat", id: personId });
  };

  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col border-r border-white/10 bg-sidebar md:w-[300px]">
      <div className="flex h-12 items-center justify-between px-4 pt-1">
        <h1 className="text-panel-title text-white">Chat</h1>
        <button className="icon-btn text-text-secondary" type="button" aria-label="Search chats">
          <IconSearch size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto px-3 pb-2 pt-1">
        {(
          [
            ["unread", "Unread"],
            ["channels", "Channels"],
            ["chats", "Chats"],
          ] as const
        ).map(([id, label]) => {
          const on = chatFilter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setChatFilter(id)}
              className={`h-7 shrink-0 rounded-full border border-solid px-3 text-[12px] leading-none ${
                on
                  ? "border-white/70 bg-white/[0.08] font-medium text-white"
                  : "border-[var(--pill-border)] bg-transparent text-[#d2d2d2] hover:border-[#8a8a8a] hover:bg-white/[0.04]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="teams-scroll teams-scroll-sidebar min-h-0 flex-1 overflow-y-auto pb-2">
        <NavRow
          icon={<IconSparkle size={22} className="text-white" />}
          label="Copilot"
          selected={view.kind === "copilot"}
          onSelect={() => navigate({ kind: "copilot" })}
        />

        <NavRow
          icon={<IconMention size={20} />}
          label="Mentions"
          selected={is({ kind: "mentions" })}
          onSelect={() => navigate({ kind: "mentions" })}
        />
        <NavRow
          icon={<IconDrafts size={20} />}
          label="Drafts"
          selected={is({ kind: "drafts" })}
          onSelect={() => navigate({ kind: "drafts" })}
        />

        {showChatSections ? (
          <>
            <div className="mx-3 my-2 h-px bg-white/10" />

            {showFavourites ? (
              <>
                <SectionHeader
                  label="Favourites"
                  open={sections.favourites}
                  onToggle={() => toggleSection("favourites")}
                />
                {sections.favourites &&
                  (favouritePeople.length === 0 ? (
                    <p className="px-4 py-1 text-[12px] text-text-secondary">No matches</p>
                  ) : (
                    favouritePeople.map((person) => (
                      <ChatRow
                        key={person.id}
                        person={person}
                        readInSession={readInSession}
                        selected={is({ kind: "chat", id: person.id })}
                        onSelect={() => openChat(person.id)}
                      />
                    ))
                  ))}
              </>
            ) : null}

            {showChats ? (
              <>
                <SectionHeader
                  label="Chats"
                  open={sections.chats}
                  onToggle={() => toggleSection("chats")}
                />
                {sections.chats &&
                  (chatPeople.length === 0 ? (
                    <p className="px-4 py-1 text-[12px] text-text-secondary">No matches</p>
                  ) : (
                    chatPeople.map((person) => (
                      <ChatRow
                        key={person.id}
                        person={person}
                        readInSession={readInSession}
                        selected={is({ kind: "chat", id: person.id })}
                        onSelect={() => openChat(person.id)}
                      />
                    ))
                  ))}
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </aside>
  );
}
