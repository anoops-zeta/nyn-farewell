import { ChatColumn } from "@/components/chat/ChatColumn";
import {
  IconAdd,
  IconAttach,
  IconDismiss,
  IconEmoji,
  IconFormat,
  IconSend,
  IconSparkle,
} from "@/icons";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useAppStore } from "@/state/AppState";
import type { KeyboardEvent } from "react";

export function ComposeBox({
  notice,
  suggestions,
}: {
  notice?: string | null;
  suggestions?: string[];
}) {
  const isMobile = useIsMobile();
  const { compose, setCompose, config, sendReply, playbackIdle } = useAppStore();
  const hasText = compose.trim().length > 0;
  const canSend = playbackIdle && hasText;

  function send() {
    if (!canSend) return;
    sendReply(compose);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  return (
    <div className="shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <ChatColumn>
        {suggestions && suggestions.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {suggestions.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => sendReply(chip)}
                className="rounded-full border border-[#4a4a4a] bg-[#2a2a2a] px-3 py-1 text-ui-sm text-text-primary hover:bg-[#333]"
              >
                {chip}
              </button>
            ))}
          </div>
        ) : null}

        {notice ? (
          <div className="flex items-center gap-2 rounded-t-lg bg-notice-bg px-3 py-1 text-[13px] leading-snug text-[#e8d4e8] max-md:text-[16px]">
            <span className="min-w-0 flex-1 truncate">{notice}</span>
            <button type="button" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#e8d4e8]/80 hover:text-white" aria-label="Dismiss">
              <IconDismiss size={12} />
            </button>
          </div>
        ) : null}

        <div
          className={`flex h-12 items-center border border-[#3d3d3d] bg-compose px-3 ${
            notice ? "rounded-b-lg rounded-t-none border-t-0" : "rounded-lg"
          }`}
        >
          <input
            value={compose}
            onChange={(e) => setCompose(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message"
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-secondary max-md:text-[16px]"
            aria-label={`Message ${config.nyn.name}`}
          />
          <div className="ml-2 flex items-center gap-0.5 text-text-secondary">
          {!isMobile ? (
            <>
              <button type="button" className="icon-btn h-7 w-7" aria-label="Format">
                <IconFormat size={18} />
              </button>
              <button type="button" className="icon-btn h-7 w-7" aria-label="Emoji">
                <IconEmoji size={18} />
              </button>
              <button type="button" className="icon-btn h-7 w-7" aria-label="Attach">
                <IconAttach size={18} />
              </button>
              <button type="button" className="icon-btn h-7 w-7" aria-label="Copilot">
                <IconSparkle size={18} />
              </button>
              <button type="button" className="icon-btn h-7 w-7" aria-label="Apps">
                <IconAdd size={18} />
              </button>
              <span className="mx-1 h-4 w-px bg-divider" />
            </>
          ) : null}
          <button
            type="button"
            className={`icon-btn h-7 w-7 ${canSend ? "text-brand-btn" : "opacity-40"}`}
            aria-label="Send"
            disabled={!canSend}
            onClick={send}
          >
            <IconSend size={18} />
          </button>
          </div>
        </div>
      </ChatColumn>
    </div>
  );
}
