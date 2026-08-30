import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

export function OverflowMenu({
  align = "right",
  items,
  children,
}: {
  align?: "left" | "right";
  items: { label: string; onClick: () => void }[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const child = Children.only(children);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!isValidElement(child)) return null;

  const trigger = cloneElement(child as ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>, {
    "aria-expanded": open,
    "aria-haspopup": "menu",
    onClick: (event) => {
      (child as ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>).props.onClick?.(event);
      setOpen((value) => !value);
    },
  });

  return (
    <div ref={root} className="relative">
      {trigger}
      {open ? (
        <div
          className={`absolute top-full z-50 mt-1 min-w-[220px] rounded-md border border-white/10 bg-[#2b2b2b] py-1 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
          role="menu"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className="flex h-9 w-full items-center px-3 text-left text-ui-sm text-text-primary hover:bg-white/10"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
