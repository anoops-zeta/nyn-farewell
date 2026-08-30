import type { ReactNode } from "react";

/** Shared width/padding for message list + compose so they align. */
export function ChatColumn({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-5xl px-3 sm:px-3 ${className}`}>{children}</div>;
}
