// Lightweight branded in-page loader (bridge mark + animated progress bar).
// Use for data-loading states inside pages. The full splash for initial route
// loads lives in src/components/setu-loading-screen.tsx (used by app/loading.tsx).
export function SetuLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-5 py-12">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-container-low)] text-[var(--primary)]">
        <BridgeIcon />
      </div>
      <div
        aria-label={label}
        className="h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-[var(--surface-container-highest)]"
        role="progressbar"
      >
        <div className="setu-progress-bar h-full w-[60%] rounded-full bg-[var(--primary)]" />
      </div>
      {label ? <p className="text-body-sm text-[var(--on-surface-variant)]">{label}</p> : null}
    </div>
  );
}

function BridgeIcon() {
  return (
    <svg aria-hidden="true" className="h-9 w-9" fill="none" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 48C17.5 36.25 26.5 30.5 36 30.5C45.5 30.5 54.5 36.25 63 48"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="7.5"
      />
      <path
        d="M21 40V52M36 30.5V52M51 40V52"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="7.5"
      />
    </svg>
  );
}
