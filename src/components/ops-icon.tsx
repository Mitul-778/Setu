// Material Symbols icon used across the desktop admin (Setu Ops) console,
// matching the Stitch design. The font is loaded in src/app/admin/layout.tsx
// and the base class is defined in globals.css.
export function OpsIcon({
  name,
  className,
  filled,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined ${className ?? ""}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
