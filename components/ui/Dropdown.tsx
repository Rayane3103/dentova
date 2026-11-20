"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type DropdownOption = {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
  /** Optional leading dot colour class, e.g. "bg-emerald-500". */
  dotClassName?: string;
};

const triggerSizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-3.5 text-sm"
} as const;

const triggerTones = {
  light:
    "border-slate-200 bg-white text-slate-800 shadow-[0_1px_0_rgba(16,20,23,0.04)] hover:border-slate-300 hover:bg-slate-50/60",
  dark:
    "border-white/15 bg-white/[0.06] text-white backdrop-blur-sm hover:border-dentova-teal-400/50 hover:bg-white/[0.1]",
  bare: "border-transparent bg-transparent text-slate-700 hover:bg-slate-100"
} as const;

type DropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  size?: keyof typeof triggerSizes;
  tone?: keyof typeof triggerTones;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
  /** Rendered instead of the plain label (used for coloured status pills). */
  renderTrigger?: (option: DropdownOption | null) => ReactNode;
  emptyLabel?: string;
};

type PanelPosition = {
  left: number;
  width: number;
  maxWidth: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
};

const PANEL_GAP = 6;
const PANEL_MAX_HEIGHT = 288;
const PANEL_MAX_WIDTH = 416;
const VIEWPORT_GUTTER = 12;

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Sélectionner",
  size = "md",
  tone = "light",
  className,
  triggerClassName,
  panelClassName,
  disabled = false,
  id,
  name,
  "aria-label": ariaLabel,
  renderTrigger,
  emptyLabel = "Aucune option"
}: DropdownProps) {
  const generatedId = useId();
  const listboxId = `${id ?? generatedId}-listbox`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const typeaheadRef = useRef<{ query: string; timer: number | null }>({
    query: "",
    timer: null
  });

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value]
  );
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - PANEL_GAP;
    const spaceAbove = rect.top - PANEL_GAP;
    const openUp = spaceBelow < 180 && spaceAbove > spaceBelow;

    // Keep the panel inside the viewport: it may be wider than its trigger,
    // which would otherwise push it past the right edge on a phone.
    const maxWidth = Math.min(
      PANEL_MAX_WIDTH,
      window.innerWidth - VIEWPORT_GUTTER * 2
    );
    const rightEdge = window.innerWidth - VIEWPORT_GUTTER;
    const left =
      rect.left + maxWidth > rightEdge
        ? Math.max(VIEWPORT_GUTTER, rightEdge - maxWidth)
        : Math.max(VIEWPORT_GUTTER, rect.left);

    setPosition({
      left,
      width: Math.min(rect.width, maxWidth),
      maxWidth,
      top: openUp ? undefined : rect.bottom + PANEL_GAP,
      bottom: openUp ? window.innerHeight - rect.top + PANEL_GAP : undefined,
      maxHeight: Math.max(
        120,
        Math.min(PANEL_MAX_HEIGHT, openUp ? spaceAbove : spaceBelow)
      )
    });
  }, []);

  // Keep the floating panel glued to its trigger while the page moves.
  useEffect(() => {
    if (!open) return;

    updatePosition();
    const handle = () => updatePosition();
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  // Reveal the highlighted row when navigating with the keyboard.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const node = panelRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const openPanel = useCallback(() => {
    if (disabled) return;
    updatePosition();
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [disabled, selectedIndex, updatePosition]);

  const commit = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;
      onChange(option.value);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [onChange, options]
  );

  const moveActive = useCallback(
    (direction: 1 | -1) => {
      if (options.length === 0) return;
      setActiveIndex((current) => {
        let next = current;
        for (let step = 0; step < options.length; step += 1) {
          next = (next + direction + options.length) % options.length;
          if (!options[next]?.disabled) return next;
        }
        return current;
      });
    },
    [options]
  );

  const runTypeahead = useCallback(
    (char: string) => {
      const state = typeaheadRef.current;
      state.query += char.toLowerCase();

      if (state.timer) window.clearTimeout(state.timer);
      state.timer = window.setTimeout(() => {
        state.query = "";
      }, 600);

      const match = options.findIndex(
        (option) =>
          !option.disabled && option.label.toLowerCase().startsWith(state.query)
      );

      if (match >= 0) {
        setActiveIndex(match);
        if (!open) commit(match);
      }
    },
    [commit, open, options]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openPanel();
          return;
        }
        moveActive(event.key === "ArrowDown" ? 1 : -1);
        return;
      case "Home":
      case "End":
        if (!open) return;
        event.preventDefault();
        setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) {
          openPanel();
          return;
        }
        commit(activeIndex);
        return;
      case "Escape":
        if (!open) return;
        event.preventDefault();
        setOpen(false);
        return;
      case "Tab":
        setOpen(false);
        return;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
          runTypeahead(event.key);
        }
    }
  };

  const panel =
    mounted && open && position
      ? createPortal(
          <AnimatePresence>
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "fixed z-[70] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_-16px_rgba(20,18,58,0.35)]",
                panelClassName
              )}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              ref={panelRef}
              style={{
                left: position.left,
                top: position.top,
                bottom: position.bottom,
                minWidth: position.width,
                maxWidth: position.maxWidth
              }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                aria-labelledby={id}
                className="overflow-y-auto overscroll-contain"
                id={listboxId}
                role="listbox"
                style={{ maxHeight: position.maxHeight }}
                tabIndex={-1}
              >
                {options.length === 0 ? (
                  <p className="px-3 py-2.5 text-sm text-slate-400">{emptyLabel}</p>
                ) : (
                  options.map((option, index) => {
                    const isSelected = option.value === value;
                    const isActive = index === activeIndex;

                    return (
                      <button
                        aria-selected={isSelected}
                        className={cn(
                          "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                          option.disabled
                            ? "cursor-not-allowed text-slate-300"
                            : "text-slate-700",
                          isActive && !option.disabled && "bg-dentova-ice",
                          isSelected && "font-semibold text-dentova-navy"
                        )}
                        data-index={index}
                        disabled={option.disabled}
                        id={`${listboxId}-option-${index}`}
                        key={option.value}
                        onClick={() => commit(index)}
                        onMouseEnter={() => setActiveIndex(index)}
                        role="option"
                        type="button"
                      >
                        {option.dotClassName ? (
                          <span
                            className={cn(
                              "mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full",
                              option.dotClassName
                            )}
                          />
                        ) : null}
                        <span className="min-w-0 flex-1 break-words leading-snug">
                          {option.label}
                          {option.hint ? (
                            <span className="ml-1.5 text-xs font-normal text-slate-400">
                              {option.hint}
                            </span>
                          ) : null}
                        </span>
                        {isSelected ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal-600" />
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <div className={cn("relative", className)}>
      {name ? <input name={name} type="hidden" value={value} /> : null}
      <button
        aria-activedescendant={
          open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        aria-controls={open ? listboxId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          "dentova-focus flex w-full items-center justify-between gap-2 rounded-lg border font-medium transition",
          triggerSizes[size],
          triggerTones[tone],
          disabled && "cursor-not-allowed opacity-60",
          triggerClassName
        )}
        disabled={disabled}
        id={id}
        onClick={() => (open ? setOpen(false) : openPanel())}
        onKeyDown={handleKeyDown}
        ref={triggerRef}
        type="button"
      >
        {renderTrigger ? (
          renderTrigger(selected)
        ) : (
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left",
              !selected && "text-slate-400"
            )}
          >
            {selected?.label ?? placeholder}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-60 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {panel}
    </div>
  );
}
