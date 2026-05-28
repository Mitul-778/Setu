import Image from "next/image";

const cityIllustration =
  "/a_subtle_minimal_grayscale_line_art_illustration_of_an_indian_city_skyline.png";

export function SetuLoadingScreen() {
  return (
    <main className="fixed inset-0 h-dvh w-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex h-full w-full max-w-[480px] flex-col overflow-hidden px-5 min-[390px]:px-6">
        <AndroidStatusBar />

        <section className="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center pb-[18dvh] min-[390px]:pb-[20dvh]">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-container-low)] min-[390px]:h-24 min-[390px]:w-24">
              <BridgeIcon />
            </div>

            <h1 className="mt-6 text-center text-[36px] font-bold leading-[44px] min-[390px]:mt-8 min-[390px]:text-[44px] min-[390px]:leading-[52px]">
              Setu
            </h1>
            <p className="mt-5 w-full whitespace-nowrap text-center text-[16px] font-normal leading-6 text-[var(--muted-foreground)]">
              Trusted local help in every new city
            </p>

            <div
              aria-label="Loading Setu"
              role="progressbar"
              className="mt-16 h-2 w-full max-w-[384px] overflow-hidden rounded-full bg-[var(--surface-container-highest)] min-[390px]:mt-24"
            >
              <div className="setu-progress-bar h-full w-[60%] rounded-full bg-[var(--primary)]" />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[170px] opacity-25 min-[390px]:h-[220px]">
            <Image
              src={cityIllustration}
              alt=""
              fill
              priority
              sizes="430px"
              className="object-contain object-bottom grayscale"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function AndroidStatusBar() {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between text-[22px] font-semibold leading-none">
      <span>9:41</span>
      <div className="flex items-center gap-3">
        <NetworkIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

function BridgeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-14 w-14 min-[390px]:h-[68px] min-[390px]:w-[68px]"
      fill="none"
      viewBox="0 0 72 72"
      xmlns="http://www.w3.org/2000/svg"
    >
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

function WifiIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 10.5C9.8 5.7 18.2 5.7 24 10.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3.2"
      />
      <path
        d="M8.5 15C11.8 12.3 16.2 12.3 19.5 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3.2"
      />
      <path
        d="M13.9 21H14.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4.4"
      />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 23H23V5L5 23Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="4"
        width="12"
        height="20"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2.6"
      />
      <path
        d="M11.5 3H16.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.6"
      />
      <rect x="11" y="8" width="6" height="12" rx="0.8" fill="currentColor" />
    </svg>
  );
}
