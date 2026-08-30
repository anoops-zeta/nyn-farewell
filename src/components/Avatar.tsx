import type { InitialsColor, PersonKind, Presence } from "@/types";

const INITIALS_BG: Record<InitialsColor, string> = {
  pink: "#c9a4ad",
  green: "#9fb89a",
  yellow: "#cbb97a",
  blue: "#9eb0c9",
  red: "#c48b8b",
  purple: "#b5a7c9",
};

const INITIALS_FG: Record<InitialsColor, string> = {
  pink: "#4a2a32",
  green: "#243628",
  yellow: "#3f3414",
  blue: "#243044",
  red: "#4a2020",
  purple: "#2e2444",
};

export function initialsFromName(name: string, fallback = ""): string {
  const parts = name.replace(/\(You\)/i, "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback || "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  src,
  initials,
  initialsColor = "purple",
  kind = "person",
  presence,
  size = 32,
  className = "",
  ring = "var(--sidebar)",
}: {
  name: string;
  src?: string | null;
  initials?: string;
  initialsColor?: InitialsColor;
  kind?: PersonKind;
  presence?: Presence | null;
  size?: number;
  className?: string;
  ring?: string;
}) {
  const letters = initials || initialsFromName(name);
  const radius = size / 2;
  const badge = Math.round(size * 0.28);

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          style={{ borderRadius: radius }}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-semibold"
          style={{
            borderRadius: radius,
            background: INITIALS_BG[initialsColor],
            color: INITIALS_FG[initialsColor],
            fontSize: Math.max(10, Math.round(size * 0.36)),
            letterSpacing: 0.2,
          }}
        >
          {letters}
        </div>
      )}
      {kind === "person" && presence ? (
        <PresenceBadge presence={presence} size={badge} ring={ring} />
      ) : null}
    </div>
  );
}

export function PresenceBadge({
  presence,
  size = 10,
  ring = "var(--sidebar)",
}: {
  presence: Presence;
  size?: number;
  ring?: string;
}) {
  const color =
    presence === "available"
      ? "var(--presence-available)"
      : presence === "away"
        ? "var(--presence-away)"
        : presence === "busy"
          ? "var(--presence-busy)"
          : presence === "ooo"
            ? "var(--presence-ooo)"
            : "var(--presence-offline)";

  return (
    <span
      className="absolute flex items-center justify-center text-black"
      style={{
        width: size,
        height: size,
        right: -1,
        bottom: -1,
        borderRadius: 999,
        background: color,
        boxShadow: `0 0 0 1.5px ${ring}`,
        color: presence === "ooo" ? "#1a1228" : "#0a0a0a",
      }}
      aria-label={presence}
    >
      {presence === "away" && (
        <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
          <circle cx="6" cy="6" r="3.4" fill="none" stroke="#3a2a00" strokeWidth="1.4" />
          <path d="M6 3.8V6l1.7 1.1" fill="none" stroke="#3a2a00" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
      {presence === "busy" && (
        <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3 6h6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
      {presence === "ooo" && (
        <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.8 6h6.4M6.6 3.8 9.4 6l-2.8 2.2" fill="none" stroke="#1a1228" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

