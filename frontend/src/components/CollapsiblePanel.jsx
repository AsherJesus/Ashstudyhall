import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Collapsible widget shell — collapsed shows just the icon pill,
 * expanded reveals the full panel. Anchor controls expand direction.
 */
export default function CollapsiblePanel({
  icon: Icon,
  label,
  children,
  defaultOpen = false,
  anchor = "br", // tl, tr, bl, br — corner the icon sits in
  testId,
  width = 300,
  iconTint = "var(--wood-dark)",
}) {
  const [open, setOpen] = useState(defaultOpen);

  const isRight = anchor === "tr" || anchor === "br";
  const isBottom = anchor === "bl" || anchor === "br";

  return (
    <div
      className="flex flex-col gap-2"
      style={{
        alignItems: isRight ? "flex-end" : "flex-start",
        flexDirection: isBottom ? "column" : "column-reverse",
      }}
      data-testid={testId ? `${testId}-shell` : undefined}
    >
      {/* Toggle pill */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cozy-card flex items-center gap-2 px-3 py-2 hover:scale-[1.03] transition-transform"
        data-testid={testId ? `${testId}-toggle` : undefined}
        aria-expanded={open}
        aria-label={`${open ? "close" : "open"} ${label}`}
        title={label}
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: `${iconTint}20` }}
        >
          <Icon size={14} color={iconTint} />
        </span>
        <span
          className="font-handwritten text-lg leading-none"
          style={{ color: "var(--text)" }}
        >
          {label}
        </span>
        <ChevronDown
          size={14}
          color="var(--text-soft)"
          style={{
            transform: open
              ? isBottom
                ? "rotate(0deg)"
                : "rotate(180deg)"
              : isBottom
                ? "rotate(180deg)"
                : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </button>

      {/* Expanded body */}
      <div
        style={{
          maxHeight: open ? 700 : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition:
            "max-height 0.45s cubic-bezier(.4,.0,.2,1), opacity 0.35s ease",
          pointerEvents: open ? "auto" : "none",
          width: open ? width : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
