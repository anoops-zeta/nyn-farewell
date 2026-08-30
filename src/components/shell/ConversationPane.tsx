import { ConversationHeader } from "@/components/shell/ConversationHeader";
import { ComposeBox } from "@/components/shell/ComposeBox";
import { PinnedBar } from "@/components/shell/PinnedBar";
import { MessageList } from "@/components/chat/MessageList";
import { NotesTab, RecapTab, SharedTab } from "@/components/chat/SharedTab";
import { CopilotPane, EmptyPane, TeamsPane } from "@/components/views/PlaceholderPanes";
import { useAppStore } from "@/state/AppState";
import type { ReactNode } from "react";

export function ConversationPane() {
  const { view, selectedPerson, tab, config, playable, playbackIdle, pendingUnlock } =
    useAppStore();

  let body: ReactNode;

  if (view.kind === "copilot") body = <CopilotPane />;
  else if (view.kind === "mentions") body = <EmptyPane title="Mentions" body={config.emptyCopy.mentions} />;
  else if (view.kind === "drafts") {
    body = <EmptyPane title="Drafts" body={config.emptyCopy.drafts} />;
  } else if (view.kind === "teams") body = <TeamsPane />;
  else if (!selectedPerson) {
    body = <EmptyPane title="No chat selected" body="Pick a conversation from the sidebar." />;
  } else {
    const visiblePerson = {
      ...selectedPerson,
      thread: playable,
    };
    const suggestions = playbackIdle && pendingUnlock ? pendingUnlock.suggestions : undefined;
    body = (
      <>
        <ConversationHeader />
        {selectedPerson.pinnedMessage ? <PinnedBar pinned={selectedPerson.pinnedMessage} /> : null}
        {tab === "chat" && <MessageList key={selectedPerson.id} person={selectedPerson} />}
        {tab === "shared" && <SharedTab person={visiblePerson} />}
        {tab === "notes" && (
          <NotesTab line={config.emptyCopy.notes} body={config.emptyCopy.notesBody} />
        )}
        {tab === "recap" && selectedPerson && <RecapTab person={selectedPerson} />}
        {tab === "chat" && <ComposeBox notice={selectedPerson.notice} suggestions={suggestions} />}
      </>
    );
  }

  return <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-surface">{body}</section>;
}
