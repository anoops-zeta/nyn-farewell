import { OverflowMenu } from "@/components/OverflowMenu";
import { Avatar } from "@/components/Avatar";
import {
  IconCall,
  IconChevronDown,
  IconChevronLeft,
  IconMore,
  IconPanelRight,
  IconPeople,
  IconPersonAdd,
  IconSearch,
  IconVideo,
} from "@/icons";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useAppStore } from "@/state/AppState";

export function ConversationHeader() {
  const { selectedPerson, showMobileList, markAllUnread } = useAppStore();
  const isMobile = useIsMobile();
  if (!selectedPerson) return null;

  const isGroup = selectedPerson.kind === "group";

  return (
    <div className="flex min-h-[56px] shrink-0 items-center gap-2 border-b border-white/10 px-2 py-3.5 pt-[max(0.875rem,env(safe-area-inset-top))] sm:min-h-[52px] sm:gap-3 sm:px-4 sm:py-1.5 sm:pt-1.5">
      {isMobile && (
        <button type="button" className="icon-btn" aria-label="Back to chats" onClick={showMobileList}>
          <IconChevronLeft size={20} />
        </button>
      )}
      <Avatar
        name={selectedPerson.name}
        src={selectedPerson.avatar}
        initialsColor={selectedPerson.initialsColor}
        kind={selectedPerson.kind}
        presence={selectedPerson.presence}
        size={36}
        ring="var(--surface)"
      />
      <h2 className="min-w-0 flex-1 truncate text-chat-name text-white">{selectedPerson.name}</h2>

      <div className="hidden items-center gap-0.5 text-text-secondary sm:flex">
        {isGroup ? (
          <button
            type="button"
            className="mr-1 hidden h-8 items-center gap-1 rounded px-2 text-ui-sm text-text-primary hover:bg-white/10 sm:flex"
          >
            <IconVideo size={18} />
            Meet now
            <IconChevronDown size={12} />
          </button>
        ) : (
          <button type="button" className="icon-btn" style={{ width: 36 }} aria-label="Call">
            <IconCall size={18} />
            <IconChevronDown size={10} className="-ml-0.5" />
          </button>
        )}
        {isGroup ? (
          <button type="button" className="icon-btn" aria-label="Members">
            <IconPeople size={18} />
          </button>
        ) : (
          <button type="button" className="icon-btn" aria-label="Add people">
            <IconPersonAdd size={18} />
          </button>
        )}
        <button type="button" className="icon-btn hidden sm:inline-flex" aria-label="Search in chat">
          <IconSearch size={18} />
        </button>
        <button type="button" className="icon-btn hidden sm:inline-flex" aria-label="Open panel">
          <IconPanelRight size={18} />
        </button>
        <OverflowMenu items={[{ label: "Mark all as unread", onClick: markAllUnread }]}>
          <button type="button" className="icon-btn" aria-label="More">
            <IconMore size={18} />
          </button>
        </OverflowMenu>
      </div>
    </div>
  );
}
