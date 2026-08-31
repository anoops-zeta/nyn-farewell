import { Avatar, initialsFromName } from "@/components/Avatar";
import { ChatColumn } from "@/components/chat/ChatColumn";
import { MessageBlocks } from "@/components/chat/MessageBlocks";
import { normalizeReactions } from "@/data/reactions";
import { toRenderItems } from "@/data/thread";
import { useThreadPlayback } from "@/hooks/useThreadPlayback";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { IconMention } from "@/icons";
import { useAppStore } from "@/state/AppState";
import type { InitialsColor, MessageNode, Person } from "@/types";
import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";

const SENDER_COLORS: InitialsColor[] = ["pink", "green", "yellow", "blue", "red", "purple"];

function colorForSender(name: string, fallback: InitialsColor): InitialsColor {
  if (!name) return fallback;
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return SENDER_COLORS[hash % SENDER_COLORS.length];
}

export function MessageList({ person }: { person: Person }) {
  const { config, playable } = useAppStore();
  const { typing } = useThreadPlayback();
  const reduced = usePrefersReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const firstPaint = useRef(true);
  const items = toRenderItems(playable);

  useEffect(() => {
    firstPaint.current = false;
  }, [person.id]);

  const scrollToBottom = () => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [person.id]);

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
  }, [person.id, playable.length, typing, items.length]);

  const animate = !reduced && !firstPaint.current;

  return (
    <div ref={scroller} className="teams-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto py-4">
      <ChatColumn className="flex flex-col gap-4">
        {items.map((item, i) => {
          if (item.type === "date") {
            return (
              <p key={`d-${i}`} className="py-2 text-center text-[14px] leading-[18px] text-text-secondary">
                {item.value}
              </p>
            );
          }
          if (item.type === "lastRead") {
            return (
              <div key={`lr-${i}`} className="flex items-center gap-3 py-2">
                <span className="h-px flex-1 bg-accent/70" />
                <span className="text-ui-xs font-semibold text-accent">Last read</span>
                <span className="h-px flex-1 bg-accent/70" />
              </div>
            );
          }
          if (item.type === "system") {
            return (
              <p key={`s-${i}`} className="py-1 text-center text-[14px] leading-[18px] text-text-secondary">
                {item.value}
              </p>
            );
          }
          if (item.type === "unlock") return null;
          return (
            <MessageGroup
              key={`g-${i}`}
              person={person}
              from={item.from}
              sender={item.sender}
              time={item.time}
              messages={item.messages}
              nynName={config.nyn.name}
              animate={animate}
            />
          );
        })}
        {typing ? <TypingRow person={person} /> : null}
      </ChatColumn>
    </div>
  );
}

function TypingRow({ person }: { person: Person }) {
  return (
    <div className="flex gap-2" aria-live="polite">
      <div className="w-8 shrink-0">
        <Avatar
          name={person.name}
          src={person.avatar}
          initialsColor={person.initialsColor}
          kind={person.kind}
          size={32}
          ring="var(--surface)"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-meta text-text-secondary">{person.name} is typing…</p>
        <div className="flex h-[44px] w-[64px] items-center justify-center gap-1 rounded-[6px] bg-bubble-in">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

function MessageGroup({
  person,
  from,
  sender,
  time,
  messages,
  nynName,
  animate,
}: {
  person: Person;
  from: MessageNode["from"];
  sender?: string;
  time: string;
  messages: MessageNode[];
  nynName: string;
  animate: boolean;
}) {
  const outgoing = from === "nyn";
  const speaker = outgoing ? nynName : sender || person.name;
  const namedInGroup = !outgoing && Boolean(sender);
  const avatarColor =
    messages[0]?.senderColor ?? (namedInGroup ? colorForSender(speaker, person.initialsColor) : person.initialsColor);

  return (
    <div className={`flex gap-2 ${outgoing ? "justify-end" : ""}`}>
      {!outgoing ? (
        <div className="w-8 shrink-0">
          <Avatar
            name={speaker}
            src={namedInGroup ? null : person.avatar}
            initials={namedInGroup ? initialsFromName(speaker) : undefined}
            initialsColor={avatarColor}
            kind={namedInGroup ? "person" : person.kind}
            size={32}
            ring="var(--surface)"
          />
        </div>
      ) : null}
      <div className={`min-w-0 flex-1 ${outgoing ? "flex flex-col items-end" : ""}`}>
        <p className={`mb-1 text-meta text-text-secondary ${outgoing ? "text-right" : ""}`}>
          {outgoing ? time : `${speaker} ${time}`}
        </p>
        <div className="flex flex-col gap-1">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex items-end gap-1.5 ${outgoing ? "flex-row-reverse" : ""} ${
                msg.reactions?.length ? "mb-3" : ""
              }`}
              initial={animate ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div
                className={`relative w-fit max-w-[min(100%,560px)] px-[18px] pt-[14px] text-left ${
                  msg.reactions?.length ? "pb-8" : "pb-[14px]"
                } ${outgoing ? "rounded-[6px] bg-bubble-out" : "rounded-[6px] bg-bubble-in"}`}
              >
                <MessageBlocks
                  blocks={msg.blocks}
                  outgoing={outgoing}
                  sender={speaker}
                  time={msg.time || time}
                />
                {msg.reactions && msg.reactions.length > 0 ? (
                  <ReactionBar reactions={msg.reactions} isDm={person.kind === "person"} />
                ) : null}
              </div>
              {msg.mentionsNyn ? (
                <IconMention size={14} className="mb-1 shrink-0 text-mention" />
              ) : null}
            </motion.div>
          ))}
        </div>
        {messages.some((m) => m.reactions?.length) ? <div className="h-3.5" /> : null}
        <span className="sr-only">{nynName}</span>
      </div>
    </div>
  );
}

function ReactionBar({
  reactions,
  isDm,
}: {
  reactions: MessageNode["reactions"];
  isDm: boolean;
}) {
  const items = normalizeReactions(reactions);

  return (
    <div className="absolute -bottom-3 left-2 flex flex-wrap gap-0.5">
      {items.map(({ emoji, by }) => (
        <span
          key={emoji}
          className="flex h-[26px] items-center rounded-full border border-white/10 bg-[#2a2a2a] px-2 text-ui-md leading-none"
        >
          {emoji}
          {!isDm && by.length > 1 ? (
            <span className="ml-0.5 text-ui-2xs text-text-secondary">{by.length}</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
