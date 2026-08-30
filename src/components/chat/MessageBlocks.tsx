import { FormattedText } from "@/components/chat/FormattedText";
import { usePhotoLightbox } from "@/components/chat/PhotoLightbox";
import {
  IconFileDoc,
  IconFilePdf,
  IconFilePpt,
  IconFileXls,
  IconMore,
  IconPlay,
  IconShare,
} from "@/icons";
import type { FileApp, MessageBlock } from "@/types";
import { assetUrl } from "@/lib/assetUrl";
import { useState } from "react";

function FileGlyph({ app }: { app: FileApp }) {
  const cls = "text-white";
  if (app === "powerpoint") return <IconFilePpt size={22} className={cls} />;
  if (app === "word") return <IconFileDoc size={22} className={cls} />;
  if (app === "excel") return <IconFileXls size={22} className={cls} />;
  return <IconFilePdf size={22} className={cls} />;
}

const APP_BG: Record<FileApp, string> = {
  powerpoint: "#c43e1c",
  word: "#2b579a",
  excel: "#217346",
  pdf: "#b30b00",
  generic: "#5a5a5a",
};

export function MessageBlocks({
  blocks,
  outgoing: _outgoing,
  sender,
  time,
}: {
  blocks: MessageBlock[];
  outgoing: boolean;
  sender?: string;
  time?: string;
}) {
  const hasCopy = blocks.some((b) => b.kind === "text" || b.kind === "quote" || b.kind === "list");
  return (
    <div className="flex flex-col gap-1.5">
      {blocks.map((block, i) => (
        <Block
          key={i}
          block={block}
          showTranscript={!hasCopy}
          sender={sender}
          time={time}
        />
      ))}
    </div>
  );
}

function Block({
  block,
  showTranscript,
  sender,
  time,
}: {
  block: MessageBlock;
  showTranscript: boolean;
  sender?: string;
  time?: string;
}) {
  if (block.kind === "text") {
    return (
      <p className="text-msg-body text-text-primary">
        <FormattedText value={block.value} />
      </p>
    );
  }
  if (block.kind === "list") {
    return (
      <ul className="my-0.5 list-disc space-y-0.5 pl-5 text-msg-body text-text-primary">
        {block.items.map((item) => (
          <li key={item}>
            <FormattedText value={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.kind === "quote") {
    return (
      <div className="mb-1.5 border-l-2 border-white/30 pl-2.5">
        <p className="text-[12px] text-text-secondary">
          {block.author} {block.time}
        </p>
        <p className="text-[13px] text-text-secondary">
          <FormattedText value={block.value} />
        </p>
      </div>
    );
  }
  if (block.kind === "image") {
    return (
      <ImageBlock
        src={assetUrl(block.src)}
        caption={block.caption}
        sender={sender}
        time={time}
      />
    );
  }
  if (block.kind === "video") {
    return (
      <VideoBlock
        src={assetUrl(block.src)}
        poster={block.poster ? assetUrl(block.poster) : undefined}
        placeholder={block.placeholder}
        embedUrl={block.embedUrl}
        transcript={showTranscript ? block.transcript : undefined}
      />
    );
  }
  if (block.kind === "file") {
    return <FileCard block={block} />;
  }
  if (block.kind === "link") {
    return <LinkCard block={block} />;
  }
  if (block.kind === "card") {
    return (
      <div className="w-[min(320px,100%)] rounded-md border border-white/10 bg-card p-3">
        <p className="text-[14px] font-semibold text-white">{block.title}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{block.body}</p>
        {block.footnote ? (
          <p className="mt-2 text-[11px] text-text-secondary">{block.footnote}</p>
        ) : null}
      </div>
    );
  }
  return null;
}

function ImageBlock({
  src,
  caption,
  sender,
  time,
}: {
  src: string;
  caption?: string;
  sender?: string;
  time?: string;
}) {
  const [failed, setFailed] = useState(false);
  const lightbox = usePhotoLightbox();
  if (failed) {
    return (
      <div
        className="flex h-[180px] w-[min(520px,100%)] items-center justify-center rounded-md bg-[#2a2a2a] text-[12px] text-text-secondary"
        style={{ maxWidth: 360 }}
      >
        Photo coming soon
      </div>
    );
  }
  return (
    <figure className="w-[min(520px,100%)]">
      <button
        type="button"
        className="block w-full cursor-zoom-in rounded-md text-left"
        onClick={() => lightbox?.open({ src, caption, sender: sender ?? "Photo", time })}
      >
        <img
          src={src}
          alt={caption ?? ""}
          loading="lazy"
          width={360}
          height={240}
          onError={() => setFailed(true)}
          className="h-auto max-h-[420px] w-full rounded-md object-cover"
        />
      </button>
      {caption ? (
        <figcaption className="mt-1.5 text-[13px] leading-5 text-text-primary">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function VideoBlock({
  src,
  poster,
  placeholder,
  embedUrl,
  transcript,
}: {
  src: string;
  poster?: string;
  placeholder?: boolean;
  embedUrl?: string;
  transcript?: string;
}) {
  const [soon, setSoon] = useState(false);
  const [failedPoster, setFailedPoster] = useState(false);

  const portraitMediaClass =
    "block h-auto max-h-[520px] w-auto max-w-full rounded-md";

  let player;
  if (embedUrl && !placeholder) {
    player = (
      <iframe
        src={embedUrl}
        title="Video"
        className="aspect-video w-full rounded-md border-0"
        allow="autoplay; encrypted-media"
        loading="lazy"
      />
    );
  } else if (!placeholder && src) {
    player = (
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className={portraitMediaClass}
      />
    );
  } else {
    player = (
      <button
        type="button"
        onClick={() => {
          if (placeholder) setSoon(true);
        }}
        className="relative block w-fit max-w-full overflow-hidden rounded-md bg-[#1a1a2a] text-left"
      >
        {poster && !failedPoster ? (
          <img
            src={poster}
            alt=""
            loading="lazy"
            width={360}
            height={640}
            onError={() => setFailedPoster(true)}
            className={portraitMediaClass}
          />
        ) : (
          <div className="aspect-[9/16] h-auto max-h-[520px] w-auto bg-[#252538]" />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white">
            <IconPlay size={28} />
          </span>
        </span>
        {soon || placeholder ? (
          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[11px] text-white">
            {soon ? "Coming soon" : "Video"}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <div className="w-fit max-w-[min(360px,100%)]">
      {player}
      {transcript ? (
        <div className="mt-2 rounded-md bg-black/25 px-2.5 py-2">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            Transcript
          </p>
          <p className="whitespace-pre-wrap text-[13px] leading-5 text-text-primary">{transcript}</p>
        </div>
      ) : null}
    </div>
  );
}

function FileCard({
  block,
}: {
  block: Extract<MessageBlock, { kind: "file" }>;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="w-[min(360px,100%)] overflow-hidden rounded-md border border-white/10 bg-card">
      <div className="flex items-start gap-2 px-3 py-2.5">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
          style={{ background: APP_BG[block.app] }}
        >
          <FileGlyph app={block.app} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-white">{block.name}</p>
          <p className="truncate text-[12px] text-text-secondary">{block.path}</p>
        </div>
        <button type="button" className="icon-btn h-7 w-7" aria-label="Share">
          <IconShare size={16} />
        </button>
        <button type="button" className="icon-btn h-7 w-7" aria-label="More">
          <IconMore size={16} />
        </button>
      </div>
      {block.preview && !failed ? (
        <img
          src={block.preview}
          alt=""
          loading="lazy"
          width={360}
          height={200}
          onError={() => setFailed(true)}
          className="max-h-[220px] w-full object-cover"
        />
      ) : null}
    </div>
  );
}

function LinkCard({ block }: { block: Extract<MessageBlock, { kind: "link" }> }) {
  return (
    <a
      href={block.url}
      target="_blank"
      rel="noreferrer"
      className="flex w-[min(360px,100%)] overflow-hidden rounded-md border border-white/10 bg-card no-underline"
    >
      {block.thumbnail ? (
        <img
          src={block.thumbnail}
          alt=""
          loading="lazy"
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 object-cover"
        />
      ) : (
        <div className="h-24 w-24 shrink-0 bg-[#333]" />
      )}
      <span className="min-w-0 flex-1 px-3 py-2">
        <span className="line-clamp-2 text-[13px] font-semibold text-white">{block.title}</span>
        {block.description ? (
          <span className="mt-0.5 line-clamp-2 text-[12px] text-text-secondary">{block.description}</span>
        ) : null}
        <span className="mt-1 block truncate text-[11px] text-text-secondary">
          {new URL(block.url, "https://nyn.me").hostname}
        </span>
      </span>
    </a>
  );
}
