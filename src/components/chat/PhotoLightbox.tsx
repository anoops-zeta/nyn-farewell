import {
  IconChevronLeft,
  IconDownload,
  IconZoomIn,
  IconZoomOut,
} from "@/icons";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PhotoLightboxItem = {
  src: string;
  caption?: string;
  sender: string;
  time?: string;
};

type Ctx = {
  open: (item: PhotoLightboxItem) => void;
  close: () => void;
};

const PhotoLightboxContext = createContext<Ctx | null>(null);

export function usePhotoLightbox() {
  return useContext(PhotoLightboxContext);
}

export function filenameFromSrc(src: string): string {
  try {
    const path = decodeURIComponent(src.split("?")[0] ?? src);
    return path.split("/").filter(Boolean).pop() ?? "photo.jpg";
  } catch {
    return "photo.jpg";
  }
}

export function PhotoLightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<PhotoLightboxItem | null>(null);
  const [zoom, setZoom] = useState(1);

  const open = useCallback((next: PhotoLightboxItem) => {
    setItem(next);
    setZoom(1);
  }, []);
  const close = useCallback(() => setItem(null), []);

  useEffect(() => {
    if (!item) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "+" || event.key === "=") setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)));
      if (event.key === "-" || event.key === "_") setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, close]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <PhotoLightboxContext.Provider value={value}>
      {children}
      {item ? (
        <div className="absolute inset-0 z-40 flex flex-col" role="dialog" aria-modal="true" aria-label="Photo">
          <div className="absolute inset-0 bg-black/70" onClick={close} />
          <header className="relative z-10 flex h-12 shrink-0 items-center gap-2 bg-[#1a1a1a]/90 px-2 text-[13px] text-text-primary">
            <button
              type="button"
              className="icon-btn h-8 w-8 text-text-secondary hover:text-white"
              aria-label="Back"
              onClick={close}
            >
              <IconChevronLeft size={20} />
            </button>
            <div className="min-w-0 flex-1 truncate">
              <span className="font-semibold text-white">{item.sender}</span>
              <span className="mx-1.5 text-text-secondary">{filenameFromSrc(item.src)}</span>
              {item.time ? (
                <>
                  <span className="text-white/25">|</span>
                  <span className="mx-1.5 text-text-secondary">{item.time}</span>
                </>
              ) : null}
              <span className="text-white/25">|</span>
              <button
                type="button"
                className="mx-1.5 text-accent hover:underline"
                onClick={close}
              >
                Show message
              </button>
            </div>
            <div className="flex shrink-0 items-center gap-0.5 pr-1">
              <button
                type="button"
                className="icon-btn h-8 w-8 text-text-secondary hover:text-white disabled:opacity-30"
                aria-label="Zoom out"
                disabled={zoom <= 0.5}
                onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
              >
                <IconZoomOut size={18} />
              </button>
              <button
                type="button"
                className="icon-btn h-8 w-8 text-text-secondary hover:text-white disabled:opacity-30"
                aria-label="Zoom in"
                disabled={zoom >= 2.5}
                onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))}
              >
                <IconZoomIn size={18} />
              </button>
              <span className="mx-1 h-4 w-px bg-white/15" />
              <a
                href={item.src}
                download={filenameFromSrc(item.src)}
                className="icon-btn h-8 w-8 text-text-secondary hover:text-white"
                aria-label="Download"
              >
                <IconDownload size={18} />
              </a>
            </div>
          </header>
          <div
            className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-auto p-6"
            onClick={close}
          >
            <img
              src={item.src}
              alt={item.caption ?? ""}
              onClick={(event) => event.stopPropagation()}
              className="max-h-full max-w-full object-contain shadow-window transition-transform duration-150"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
            />
          </div>
        </div>
      ) : null}
    </PhotoLightboxContext.Provider>
  );
}
