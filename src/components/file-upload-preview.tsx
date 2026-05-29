"use client";

import { type LucideIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

export function FileUploadPreview({
  accept = "image/*",
  className,
  emptyClassName,
  hint,
  icon: Icon,
  label,
  multiple = false,
  onFilesChange,
  previewClassName,
  previewItemClassName,
}: {
  accept?: string;
  className?: string;
  emptyClassName?: string;
  hint?: string;
  icon: LucideIcon;
  label: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  previewClassName?: string;
  previewItemClassName?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);

  function updateFiles(nextFiles: File[]) {
    const imageFiles = nextFiles.filter((file) => file.type.startsWith("image/"));
    setFiles(imageFiles);
    onFilesChange?.(imageFiles);
  }

  function removeFile(index: number) {
    updateFiles(files.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className={className ?? "flex flex-col gap-3"}>
      <label className={emptyClassName ?? "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-center"}>
        <input
          accept={accept}
          className="sr-only"
          multiple={multiple}
          onChange={(event) => updateFiles(Array.from(event.target.files ?? []))}
          type="file"
        />
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)]">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-label-lg text-[var(--on-surface)]">{label}</span>
        {hint ? <span className="max-w-[240px] text-body-sm text-[var(--on-surface-variant)]">{hint}</span> : null}
      </label>

      {files.length ? (
        <div className={previewClassName ?? "grid grid-cols-3 gap-2"}>
          {files.map((file, index) => (
            <div
              className={previewItemClassName ?? "relative min-h-24 overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]"}
              key={`${file.name}-${file.lastModified}-${index}`}
            >
              <ImagePreview file={file} icon={Icon} />
              <button
                aria-label={`Remove ${file.name}`}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-container-lowest)] text-[var(--on-surface)] shadow-[0_1px_4px_rgb(0_0_0_/_0.16)]"
                onClick={() => removeFile(index)}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ImagePreview({ file, icon: Icon }: { file: File; icon: LucideIcon }) {
  const previewUrl = useImagePreviewUrl(file);

  if (!previewUrl) {
    return (
      <div className="flex h-full min-h-24 flex-col items-center justify-center gap-1 p-2 text-center">
        <Icon className="h-5 w-5 text-[var(--on-surface-variant)]" />
        <span className="line-clamp-2 text-label-sm text-[var(--on-surface)]">{file.name}</span>
      </div>
    );
  }

  return (
    <img
      alt={`Preview of ${file.name}`}
      className="h-full min-h-24 w-full object-cover grayscale"
      src={previewUrl}
    />
  );
}

function useImagePreviewUrl(file: File) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [file]);

  return previewUrl;
}
