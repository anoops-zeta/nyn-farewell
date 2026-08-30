import { useIsMobile } from "@/hooks/useMediaQuery";
import { IconChevronLeft } from "@/icons";
import { useAppStore } from "@/state/AppState";

export function MobileBackHeader({ title }: { title: string }) {
  const isMobile = useIsMobile();
  const { showMobileList } = useAppStore();

  if (!isMobile) return null;

  return (
    <div className="flex min-h-[56px] shrink-0 items-center gap-2 border-b border-white/10 px-2 py-3.5 pt-[max(0.875rem,env(safe-area-inset-top))]">
      <button type="button" className="icon-btn" aria-label="Back to chats" onClick={showMobileList}>
        <IconChevronLeft size={20} />
      </button>
      <h2 className="min-w-0 flex-1 truncate text-chat-name text-white">{title}</h2>
    </div>
  );
}
