import { IconAdd, IconMic, IconMore, IconSend, IconSparkle } from "@/icons";
import { useAppStore } from "@/state/AppState";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

function matchCopilot(query: string, rules: { patterns: string[]; response: string }[], fallback: string) {
  const q = query.toLowerCase();
  for (const rule of rules) {
    if (rule.patterns.some((p) => q.includes(p.toLowerCase()))) return rule.response;
  }
  return fallback;
}

export function CopilotPane() {
  const { config } = useAppStore();
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [showMore, setShowMore] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const chips = [
    ...(config.copilot.suggestions ?? []),
    ...(showMore ? config.copilot.moreSuggestions ?? [] : []),
  ];

  const scrollToBottom = () => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [turns.length]);

  useEffect(() => {
    scrollToBottom();
    const raf = requestAnimationFrame(scrollToBottom);
    const t1 = window.setTimeout(scrollToBottom, 50);
    const t2 = window.setTimeout(scrollToBottom, 300);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [turns.length]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    const reply = matchCopilot(q, config.copilot.rules, config.copilot.defaultResponse);
    setTurns((prev) => [...prev, { role: "user", text: q }, { role: "bot", text: reply }]);
    setDraft("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    send(draft);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(draft);
    }
  }

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-[#1a1a1a]">
      {turns.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8">
          <div className="mb-5">
            <IconSparkle size={40} className="text-accent" />
          </div>
          <h2 className="px-4 text-center text-ui-xl font-semibold tracking-tight text-white sm:text-[28px]">
            Welcome to Copilot Chat
          </h2>
        </div>
      ) : (
        <div ref={scroller} className="teams-scroll min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex max-w-[720px] flex-col gap-4">
            {turns.map((turn, i) => (
              <div
                key={i}
                className={`max-w-[90%] whitespace-pre-wrap rounded-xl px-4 py-3 text-ui-base leading-relaxed ${
                  turn.role === "user"
                    ? "self-end bg-bubble-out text-white"
                    : "self-start bg-[#252525] text-text-primary"
                }`}
              >
                {turn.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto flex h-12 w-full max-w-[720px] items-center rounded-xl border border-[#3d3d3d] bg-[#252525] px-3">
          <button type="button" className="icon-btn hidden h-8 w-8 sm:inline-flex" aria-label="Add">
            <IconAdd size={18} />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message Copilot"
            className="h-full min-w-0 flex-1 bg-transparent px-2 text-ui-base text-text-primary outline-none placeholder:text-text-secondary"
            aria-label="Message Copilot"
          />
          <button type="button" className="icon-btn hidden h-8 w-8 sm:inline-flex" aria-label="Voice">
            <IconMic size={18} />
          </button>
          <button
            type="submit"
            className={`icon-btn h-8 w-8 ${draft.trim() ? "text-brand-btn" : "opacity-40"}`}
            aria-label="Send"
            disabled={!draft.trim()}
          >
            <IconSend size={18} />
          </button>
        </div>
        {chips.length > 0 ? (
          <div className="mx-auto mt-4 flex max-w-[720px] flex-wrap items-center justify-center gap-2 px-4">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => send(chip)}
                className="h-8 rounded-full border border-[#4a4a4a] bg-[#2a2a2a] px-3.5 text-ui-sm text-text-primary hover:bg-[#333]"
              >
                {chip}
              </button>
            ))}
            {!showMore && (config.copilot.moreSuggestions?.length ?? 0) > 0 ? (
              <button
                type="button"
                onClick={() => setShowMore(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#4a4a4a] bg-[#2a2a2a] text-text-secondary hover:bg-[#333] hover:text-text-primary"
                aria-label="More suggestions"
              >
                <IconMore size={16} />
              </button>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}

export function EmptyPane({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center bg-surface px-8 text-center">
      <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-[#2a2a2a]">
        <span className="text-ui-display font-light leading-none text-[#5a5a5a]">@</span>
      </div>
      <p className="max-w-sm text-ui-lg font-semibold text-white">{title}</p>
      <p className="mt-2 max-w-sm text-ui-base leading-relaxed text-text-secondary">{body}</p>
    </div>
  );
}

export function TeamsPane() {
  const { config } = useAppStore();
  return (
    <EmptyPane
      title={config.studio.name}
      body="Channels land in a later milestone. For now this is just the Teams and channels entry."
    />
  );
}
