import { Avatar } from "@/components/Avatar";
import { IconApps, IconSearch } from "@/icons";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useAppStore } from "@/state/AppState";

export function TopBar() {
  const isMobile = useIsMobile();
  const { config } = useAppStore();

  return (
    <header className="relative z-20 flex h-[calc(3rem+env(safe-area-inset-top,0px))] shrink-0 items-center bg-topbar px-3 pt-[env(safe-area-inset-top,0px)] sm:h-[calc(52px+env(safe-area-inset-top,0px))] sm:px-4">
      <button type="button" className="icon-btn shrink-0" aria-label="Apps">
        <IconApps size={20} className="text-white" />
      </button>

      <label className="pointer-events-none absolute left-1/2 flex h-9 w-[min(720px,calc(100%-13rem))] -translate-x-1/2 items-center gap-2 rounded-lg border border-white/10 bg-search-pill px-3 text-text-secondary">
        <IconSearch size={18} className="shrink-0 opacity-80" />
        <span className="truncate text-ui-base leading-none">
          {isMobile ? "Search" : "Search (⌘ E)"}
        </span>
        <input className="sr-only" placeholder="Search" readOnly aria-label="Search" />
      </label>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
        <span className="hidden max-w-[148px] truncate text-[13px] text-text-primary lg:inline max-md:text-[14px]">
          {config.tenant.shortName}
        </span>
        <Avatar
          name={config.nyn.name}
          src={config.nyn.avatar}
          initials={config.nyn.initials}
          initialsColor={config.nyn.initialsColor}
          presence={config.nyn.presence}
          size={32}
          ring="var(--topbar)"
        />
      </div>
    </header>
  );
}
