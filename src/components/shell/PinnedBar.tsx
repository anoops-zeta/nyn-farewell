import { IconMore, IconPin } from "@/icons";
import type { PinnedMessage } from "@/types";

export function PinnedBar({ pinned }: { pinned: PinnedMessage }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/5 bg-pinned px-4 text-[13px]">
      <IconPin size={14} className="shrink-0 text-text-secondary" />
      <span className="shrink-0 font-semibold text-text-primary">{pinned.author}</span>
      <span className="min-w-0 flex-1 truncate text-text-secondary">{pinned.text}</span>
      <span className="shrink-0 text-text-secondary">{pinned.date}</span>
      <button type="button" className="icon-btn h-6 w-6" aria-label="Pinned message options">
        <IconMore size={16} />
      </button>
    </div>
  );
}
