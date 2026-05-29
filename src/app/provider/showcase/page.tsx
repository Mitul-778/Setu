import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  FileText,
  ImagePlus,
  Info,
  Plus,
  Quote,
  ShieldCheck,
  Utensils,
  Video,
} from "lucide-react";

const photoSlots = ["Bridal design", "Kitchen setup", "Event work"];

const serviceMenu = [
  { name: "Basic service", price: "₹799", note: "Good for small requests" },
  { name: "Premium package", price: "₹2,000", note: "Includes materials and travel" },
];

const testimonials = [
  {
    quote: "Excellent service, very professional and on time.",
    author: "Previous Client",
  },
  {
    quote: "Clear communication and neat work. Would book again.",
    author: "Local Customer",
  },
];

export default function ProviderShowcasePage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface)]"
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Register as Provider
            </h1>
            <button
              aria-label="Verification status"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
              type="button"
            >
              <ShieldCheck className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="px-4 py-5 min-[390px]:px-5 min-[390px]:py-6">
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-label-md text-[var(--on-surface-variant)]">
                Step 3 of 4
              </span>
              <span className="text-label-md text-[var(--on-surface)]">
                Showcase
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--surface-container-highest)]" />
            </div>
          </div>

          <div>
            <h2 className="text-headline-lg text-[var(--on-surface)]">
              Showcase your work
            </h2>
            <p className="mt-2 text-body-md text-[var(--on-surface-variant)]">
              Upload media, customer proof, service details, and documents to build trust with customers.
            </p>
          </div>

          <section className="mt-6">
            <SectionTitle title="Photos" badge="Required" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              <UploadTile label="Upload" icon={ImagePlus} />
              {photoSlots.map((label) => (
                <div
                  className="aspect-square rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container)] p-2"
                  key={label}
                >
                  <div className="flex h-full flex-col justify-end rounded bg-[var(--surface-container-high)] p-2">
                    <span className="text-label-sm text-[var(--on-surface)]">{label}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-body-sm text-[var(--on-surface-variant)]">
              Add at least 3 photos of previous work, workspace, tools, or finished service results.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle title="Intro Video" badge="Optional" />
            <button
              className="mt-3 flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-center"
              type="button"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-container-high)] text-[var(--on-surface)]">
                <Video className="h-6 w-6" />
              </span>
              <span className="mt-3 text-label-lg text-[var(--on-surface)]">Record or upload video</span>
              <span className="mt-1 text-body-sm text-[var(--on-surface-variant)]">30-60 seconds</span>
            </button>
          </section>

          <Divider />

          <section>
            <SectionTitle title="Service Menu / Packages" badge="Recommended" />
            <button
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-label-lg"
              type="button"
            >
              <FileText className="h-5 w-5" />
              Upload Menu PDF
            </button>
            <div className="mt-3 flex flex-col gap-2">
              {serviceMenu.map(({ name, note, price }) => (
                <article
                  className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3"
                  key={name}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-label-lg text-[var(--on-surface)]">{name}</h3>
                      <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{note}</p>
                    </div>
                    <span className="shrink-0 text-label-lg text-[var(--primary)]">{price}</span>
                  </div>
                </article>
              ))}
            </div>
            <button className="mt-2 flex min-h-10 items-center gap-2 text-label-md text-[var(--primary)]" type="button">
              <Plus className="h-4 w-4" />
              Add package manually
            </button>
          </section>

          <Divider />

          <section>
            <SectionTitle title="Professional Documents" badge="Trust" />
            <div className="mt-3 flex flex-col gap-3">
              <article className="rounded-lg border-2 border-[var(--primary)] bg-[var(--surface-container-lowest)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container)] text-[var(--primary)]">
                      <Utensils className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-label-lg text-[var(--on-surface)]">FSSAI Document</h3>
                      <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                        Visible for food providers. Upload license or registration proof if you cook, cater, or sell food.
                      </p>
                    </div>
                  </div>
                  <span className="rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm text-[var(--on-surface-variant)]">
                    Food
                  </span>
                </div>
                <div className="mt-4 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-label-md text-[var(--on-surface)]">FSSAI_Cert_2023.pdf</p>
                      <p className="text-body-sm text-[var(--on-surface-variant)]">1.2 MB</p>
                    </div>
                    <Check className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                  </div>
                </div>
                <button className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] text-label-md" type="button">
                  <FileText className="h-4 w-4" />
                  Upload / Replace FSSAI
                </button>
              </article>

              <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container)] text-[var(--primary)]">
                    <Award className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-label-lg text-[var(--on-surface)]">Other Licenses or Certificates</h3>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                      Add training certificates, trade licenses, safety documents, or awards.
                    </p>
                  </div>
                </div>
                <button className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-dashed border-[var(--outline)] bg-[var(--surface)] text-label-md" type="button">
                  <Plus className="h-4 w-4" />
                  Upload Document
                </button>
              </article>
            </div>
          </section>

          <Divider />

          <section className="mb-6">
            <SectionTitle title="Customer Testimonials" badge="Optional" />
            <p className="mt-2 text-body-sm text-[var(--on-surface-variant)]">
              Upload screenshots of reviews from other platforms or type them in.
            </p>
            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
              <button
                className="flex aspect-square w-32 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-center"
                type="button"
              >
                <ImagePlus className="h-6 w-6 text-[var(--outline)]" />
                <span className="mt-2 text-label-sm text-[var(--outline)]">Add Screenshot</span>
              </button>
              {testimonials.map(({ author, quote }) => (
                <article
                  className="flex aspect-square w-40 shrink-0 flex-col rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3"
                  key={quote}
                >
                  <Quote className="h-5 w-5 text-[var(--on-surface-variant)]" />
                  <p className="mt-2 line-clamp-4 text-body-sm text-[var(--on-surface)]">{quote}</p>
                  <p className="mt-auto text-label-sm text-[var(--on-surface-variant)]">- {author}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--surface-variant)] bg-[var(--surface-container-low)] p-3">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
              <p className="text-body-sm text-[var(--on-surface-variant)]">
                Strong photos, menus, documents, and testimonials increase customer confidence before booking.
              </p>
            </div>
          </section>
        </section>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
          <div className="grid grid-cols-[1fr_1.35fr] gap-3">
            <button
              className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 text-label-lg text-[var(--on-surface-variant)]"
              type="button"
            >
              Save Draft
            </button>
            <button
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
              type="button"
            >
              <span>Continue</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}

function SectionTitle({ badge, title }: { badge: string; title: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-headline-sm text-[var(--on-surface)]">{title}</h3>
      <span className="rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm text-[var(--on-surface-variant)]">
        {badge}
      </span>
    </div>
  );
}

function UploadTile({
  icon: Icon,
  label,
}: {
  icon: typeof ImagePlus;
  label: string;
}) {
  return (
    <button
      className="aspect-square rounded-md border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-center"
      type="button"
    >
      <span className="flex h-full flex-col items-center justify-center gap-2">
        <Icon className="h-6 w-6 text-[var(--outline)]" />
        <span className="text-label-sm text-[var(--outline)]">{label}</span>
      </span>
    </button>
  );
}

function Divider() {
  return <div className="my-6 h-px bg-[var(--surface-container-highest)]" />;
}
