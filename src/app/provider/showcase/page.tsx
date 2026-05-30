"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  FileText,
  ImagePlus,
  Info,
  Plus,
  ShieldCheck,
  Utensils,
  Video,
} from "lucide-react";
import { FileUploadPreview } from "@/components/file-upload-preview";
import {
  loadProviderShowcase,
  saveProviderShowcase,
  type ProviderShowcaseFile,
} from "@/services/provider-showcase-service";

type SavingAction = "draft" | "continue" | null;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function ProviderShowcasePage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [introVideos, setIntroVideos] = useState<File[]>([]);
  const [menuImages, setMenuImages] = useState<File[]>([]);
  const [fssaiDocuments, setFssaiDocuments] = useState<File[]>([]);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [portfolio, setPortfolio] = useState<ProviderShowcaseFile[]>([]);
  const [documents, setDocuments] = useState<ProviderShowcaseFile[]>([]);
  const [requiresFssai, setRequiresFssai] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savingAction, setSavingAction] = useState<SavingAction>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    loadProviderShowcase()
      .then((data) => {
        if (cancelled) return;
        setPortfolio(data.portfolio);
        setDocuments(data.documents);
        setRequiresFssai(data.requiresFssai);
        setError("");
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function persistShowcase(action: Exclude<SavingAction, null>) {
    setSavingAction(action);
    setError("");

    try {
      const saved = await saveProviderShowcase({
        photos,
        introVideos,
        menuImages,
        fssaiDocuments: requiresFssai ? fssaiDocuments : [],
        certificates,
      });

      setPortfolio(saved.portfolio);
      setDocuments(saved.documents);
      setRequiresFssai(saved.requiresFssai);
      setPhotos([]);
      setIntroVideos([]);
      setMenuImages([]);
      setFssaiDocuments([]);
      setCertificates([]);

      if (action === "continue") {
        router.push(saved.nextPath);
      }
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSavingAction(null);
    }
  }

  const isBusy = isLoading || savingAction !== null;
  const savedPhotos = portfolio.filter((item) => item.type === "photo");
  const remainingPhotoSlots = Math.max(0, 5 - savedPhotos.length);
  const savedIntroVideos = portfolio.filter((item) => item.type === "intro_video" || item.type === "intro_image");
  const savedMenuImages = portfolio.filter((item) => item.type === "service_menu");
  const photoCount = savedPhotos.length + photos.length;
  const photoPlaceholderCount = Math.max(0, 3 - photoCount - (remainingPhotoSlots ? 1 : 0));
  const savedFssai = requiresFssai ? documents.filter((item) => item.type === "fssai") : [];
  const savedCertificates = documents.filter((item) => item.type === "certificate");

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface)]"
              onClick={() => router.back()}
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
              onClick={() => router.push("/provider/verification-status")}
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

          {isLoading ? (
            <div className="mt-4 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 py-2 text-body-sm text-[var(--on-surface-variant)]">
              Loading saved showcase details...
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </div>
          ) : null}

          <section className="mt-6">
            <SectionTitle title="Photos" badge="Required" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {remainingPhotoSlots ? (
                <FileUploadPreview
                  accept="image/*"
                  className="contents"
                  emptyClassName="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-center transition-colors active:opacity-70"
                  icon={ImagePlus}
                  label="Upload"
                  maxFiles={remainingPhotoSlots}
                  multiple
                  onFilesChange={setPhotos}
                  previewClassName="contents"
                  previewItemClassName="relative aspect-square h-full w-full overflow-hidden rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]"
                />
              ) : null}
              {savedPhotos.slice(0, 5).map((item) => <SavedSquareImage item={item} key={item.id} />)}
              {Array.from({ length: photoPlaceholderCount }).map((_, index) => (
                <div
                  className="aspect-square h-full w-full animate-pulse rounded-md border border-[var(--surface-container-highest)] bg-[var(--surface-container)]"
                  key={`photo-placeholder-${index}`}
                />
              ))}
            </div>
            <p className="mt-2 text-body-sm text-[var(--on-surface-variant)]">
              Add at least 3 photos of your previous work or workspace.
            </p>
          </section>

          <Divider />

          <section>
            <SectionTitle title="Intro Video" badge="Optional" />
            <IntroVideoUpload file={introVideos[0]} onChange={setIntroVideos} />
            <SavedMediaList items={savedIntroVideos} showThumbnail={false} />
          </section>

          <Divider />

          <section>
            <SectionTitle title="Service Menu / Packages" badge="Recommended" />
            <FileUploadPreview
              accept="image/*"
              className="mt-3 flex flex-col gap-3"
              emptyClassName="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-label-lg"
              icon={FileText}
              label="Upload Menu Image"
              onFilesChange={setMenuImages}
              previewMode="file-name"
            />
            <SavedMediaList items={savedMenuImages} showThumbnail={false} />
          </section>

          <Divider />

          <section>
            <SectionTitle title="Professional Documents" badge="Trust" />
            <div className="mt-3 flex flex-col gap-3">
              {requiresFssai ? (
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
                <SavedDocumentList items={savedFssai} />
                <FileUploadPreview
                  accept="image/*"
                  className="mt-3 flex flex-col gap-3"
                  emptyClassName="flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] text-label-md"
                  icon={FileText}
                  label="Upload / Replace FSSAI"
                  onFilesChange={setFssaiDocuments}
                />
              </article>
              ) : null}
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
                <SavedDocumentList items={savedCertificates} />
                <FileUploadPreview
                  accept="image/*"
                  className="mt-3 flex flex-col gap-3"
                  emptyClassName="flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[var(--outline)] bg-[var(--surface)] text-label-md"
                  icon={Plus}
                  label="Upload Document"
                  multiple
                  onFilesChange={setCertificates}
                />
              </article>
            </div>
          </section>

          <section className="rounded-lg border border-[var(--surface-variant)] bg-[var(--surface-container-low)] p-3">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
              <p className="text-body-sm text-[var(--on-surface-variant)]">
                Strong photos, menus, and documents increase customer confidence before booking.
              </p>
            </div>
          </section>
        </section>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
          <div className="grid grid-cols-[1fr_1.35fr] gap-3">
            <button
              className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 text-label-lg text-[var(--on-surface-variant)] disabled:opacity-60"
              disabled={isBusy}
              onClick={() => persistShowcase("draft")}
              type="button"
            >
              {savingAction === "draft" ? "Saving..." : "Save Draft"}
            </button>
            <button
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
              disabled={isBusy}
              onClick={() => persistShowcase("continue")}
              type="button"
            >
              <span>{savingAction === "continue" ? "Saving..." : "Continue"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}

function IntroVideoUpload({ file, onChange }: { file?: File; onChange: (files: File[]) => void }) {
  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : "", [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <input
        accept="video/*"
        className="sr-only"
        id="intro-video-upload"
        onChange={(event) => onChange(Array.from(event.target.files ?? []).slice(0, 1))}
        type="file"
      />
      {previewUrl ? (
        <>
          <video
            className="h-full w-full object-cover grayscale"
            controls
            muted
            playsInline
            src={previewUrl}
          />
          <label
            className="absolute right-2 top-2 z-10 cursor-pointer rounded-full bg-[var(--surface-container-lowest)] px-3 py-1.5 text-label-sm text-[var(--on-surface)] shadow-[0_1px_4px_rgb(0_0_0_/_0.16)]"
            htmlFor="intro-video-upload"
          >
            Replace
          </label>
        </>
      ) : (
        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center transition-colors active:opacity-70" htmlFor="intro-video-upload">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-container-high)] text-[var(--on-surface)]">
            <Video className="h-6 w-6" />
          </span>
          <span className="mt-2 text-label-md text-[var(--on-surface)]">Record or upload video</span>
          <span className="mt-1 text-body-sm text-[var(--on-surface-variant)]">30-60 seconds</span>
        </label>
      )}
    </div>
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

function SavedSquareImage({ item }: { item: ProviderShowcaseFile }) {
  return (
    <div className="relative aspect-square h-full w-full overflow-hidden rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <img alt={item.label} className="h-full w-full object-cover grayscale" src={item.url} />
      <span className="absolute bottom-1 left-1 right-1 truncate rounded bg-[var(--surface-container-lowest)]/90 px-1.5 py-1 text-label-sm text-[var(--on-surface)]">
        Saved
      </span>
    </div>
  );
}

function SavedWideImage({ item }: { item: ProviderShowcaseFile }) {
  return (
    <div className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <img alt={item.label} className="h-full w-full object-cover grayscale" src={item.url} />
    </div>
  );
}

function SavedMediaList({ items, showThumbnail = true }: { items: ProviderShowcaseFile[]; showThumbnail?: boolean }) {
  if (!items.length) return null;

  return (
    <div className="mt-3 flex flex-col gap-2">
      {items.map((item) => (
        <a
          className="flex min-h-12 items-center gap-3 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-2 text-label-md text-[var(--on-surface)]"
          href={item.url}
          key={item.id}
          rel="noreferrer"
          target="_blank"
        >
          {showThumbnail ? <img alt={item.label} className="h-10 w-10 rounded object-cover grayscale" src={item.url} /> : <FileText className="h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />}
          <span className="min-w-0 flex-1 truncate">{item.fileName ?? item.label}</span>
          <Check className="h-4 w-4 shrink-0" />
        </a>
      ))}
    </div>
  );
}

function SavedDocumentList({ items }: { items: ProviderShowcaseFile[] }) {
  if (!items.length) return null;

  return (
    <div className="mt-4 flex flex-col gap-2">
      {items.map((item) => (
        <a
          className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3"
          href={item.url}
          key={item.id}
          rel="noreferrer"
          target="_blank"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-label-md text-[var(--on-surface)]">{item.fileName ?? item.label}</p>
              <p className="text-body-sm text-[var(--on-surface-variant)]">Saved document</p>
            </div>
            <Check className="h-5 w-5 shrink-0 text-[var(--primary)]" />
          </div>
        </a>
      ))}
    </div>
  );
}

function Divider() {
  return <div className="my-6 h-px bg-[var(--surface-container-highest)]" />;
}
