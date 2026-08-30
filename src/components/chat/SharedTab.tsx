import { MessageBlocks } from "@/components/chat/MessageBlocks";
import { collectShared } from "@/data";
import { useAppStore } from "@/state/AppState";
import type { Person } from "@/types";

export function SharedTab({ person }: { person: Person }) {
  const { config } = useAppStore();
  const items = collectShared(person);
  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-ui-sm text-text-secondary">
          {config.emptyCopy.sharedEmpty ?? "Nothing has been shared in this chat yet."}
        </p>
      </div>
    );
  }
  return (
    <div className="teams-scroll min-h-0 flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, i) => (
          <div key={`${item.personId}-${item.messageIndex}-${i}`} className="min-w-0">
            <MessageBlocks blocks={[item.block]} outgoing={false} sender={person.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecapTab({ person }: { person: Person }) {
  const { config } = useAppStore();
  const recap = config.copy?.recap;
  const count = person.thread.filter((n) => n.type === "message").length;
  const body =
    recap?.overrides?.[person.id] ??
    (recap
      ? recap.template
          .replace("{name}", person.name)
          .replace("{count}", String(count))
          .replace("{themes}", recap.themesFallback)
      : `${person.name} sent ${count} messages.`);

  return (
    <div className="teams-scroll min-h-0 flex-1 overflow-y-auto px-6 py-5">
      <p className="text-ui-base font-semibold text-white">{recap?.header ?? "Recap"}</p>
      <p className="mt-1 text-ui-sm text-text-secondary">
        {recap?.subheader ?? "AI-generated summary of this conversation"}
      </p>
      <p className="mt-4 whitespace-pre-wrap text-ui-base leading-relaxed text-text-primary">{body}</p>
      {recap?.footnote ? (
        <p className="mt-6 text-ui-xs text-text-secondary">{recap.footnote}</p>
      ) : null}
    </div>
  );
}

export function NotesTab({ line, body }: { line: string; body?: string }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface px-6 py-5">
      <p className="text-ui-base text-text-primary">{line}</p>
      {body ? <p className="mt-4 text-ui-base text-text-secondary">{body}</p> : null}
    </div>
  );
}
