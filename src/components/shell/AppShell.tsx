import { PhotoLightboxProvider } from "@/components/chat/PhotoLightbox";
import { ConversationPane } from "@/components/shell/ConversationPane";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useAppStore } from "@/state/AppState";

export function AppShell() {
  const isMobile = useIsMobile();
  const { sidebarOpen, mobileShowList } = useAppStore();
  const showSidebar = isMobile ? mobileShowList : sidebarOpen;
  const showPane = isMobile ? !mobileShowList : true;

  return (
    <div className="flex h-dvh w-full min-h-0 flex-col bg-surface text-text-primary">
      {!isMobile ? <TopBar /> : null}
      <PhotoLightboxProvider>
        <div className="relative flex min-h-0 min-w-0 flex-1">
          {showSidebar ? <Sidebar /> : null}
          {showPane ? <ConversationPane /> : null}
        </div>
      </PhotoLightboxProvider>
    </div>
  );
}
