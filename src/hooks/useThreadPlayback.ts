import { useAppStore } from "@/state/AppState";
import { useEffect } from "react";

/** Reveal the full thread immediately — farewell messages are not gated behind replies. */
export function useThreadPlayback() {
  const { selectedPerson, selectedProgress, playable, setChatProgress } = useAppStore();

  const personId = selectedPerson?.id;
  const revealed = selectedProgress?.revealed ?? 0;
  const unread = selectedPerson?.unread ?? false;
  const playableLength = playable.length;

  useEffect(() => {
    if (!personId || !selectedProgress) return;
    if (revealed !== playableLength || unread) {
      setChatProgress(personId, { revealed: playableLength, unread: false });
    }
  }, [personId, playableLength, revealed, selectedProgress, setChatProgress, unread]);

  return { typing: false };
}
