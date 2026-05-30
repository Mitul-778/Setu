"use client";

import { type LucideIcon, X } from "lucide-react";
import { useMemo, useState } from "react";

export function FileUploadPreview({
  accept = "image/*",
  className,
  emptyClassName,
  hint,
  icon: Icon,
  label,
  maxFiles,
  multiple = false,
  previewMode = "image",
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
  maxFiles?: number;
  multiple?: boolean;
  previewMode?: "image" | "file-name";
  onFilesChange?: (files: File[]) => void;
  previewClassName?: string;
  previewItemClassName?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const effectiveMaxFiles = multiple ? maxFiles : 1;
  const singleFilePreview = !multiple && files.length > 0;
  const defaultEmptyClassName = "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-center";
  const uploadBoxClassName = `${emptyClassName ?? defaultEmptyClassName} ${singleFilePreview ? "relative overflow-hidden" : ""}`;

  function normalizeFiles(nextFiles: File[]) {
    return nextFiles
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, effectiveMaxFiles);
  }

  function updateFiles(nextFiles: File[]) {
    const imageFiles = normalizeFiles(nextFiles);
    setFiles(imageFiles);
    onFilesChange?.(imageFiles);
  }

  function appendFiles(nextFiles: File[]) {
    updateFiles(multiple ? [...files, ...nextFiles] : nextFiles);
  }

  function removeFile(index: number) {
    updateFiles(files.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className={className ?? "flex flex-col gap-3"}>
      <label className={uploadBoxClassName}>
        <input
          accept={accept}
          className="sr-only"
          multiple={multiple}
          onChange={(event) => {
            appendFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
          type="file"
        />
        {singleFilePreview ? (
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
            {previewMode === "file-name" ? <FileNamePreview file={files[0]} icon={Icon} /> : <ImagePreview file={files[0]} icon={Icon} />}
            <button
              aria-label={`Remove ${files[0].name}`}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-container-lowest)] text-[var(--on-surface)] shadow-[0_1px_4px_rgb(0_0_0_/_0.16)]"
              onClick={(event) => {
                event.preventDefault();
                removeFile(0);
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)]">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-label-lg text-[var(--on-surface)]">{label}</span>
            {hint ? <span className="max-w-[240px] text-body-sm text-[var(--on-surface-variant)]">{hint}</span> : null}
          </>
        )}
      </label>

      {multiple && files.length ? (
        <div className={previewClassName ?? "grid grid-cols-3 gap-2"}>
          {files.map((file, index) => (
            <div
              className={previewItemClassName ?? "relative min-h-24 overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]"}
              key={`${file.name}-${file.lastModified}-${index}`}
            >
              {previewMode === "file-name" ? <FileNamePreview file={file} icon={Icon} /> : <ImagePreview file={file} icon={Icon} />}
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

function FileNamePreview({ file, icon: Icon }: { file: File; icon: LucideIcon }) {
  return (
    <div className="flex h-full min-h-0 w-full items-center gap-3 p-3 text-left">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container)] text-[var(--on-surface-variant)]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1 truncate text-label-md text-[var(--on-surface)]">{file.name}</span>
    </div>
  );
}

function ImagePreview({ file, icon: Icon }: { file: File; icon: LucideIcon }) {
  const previewUrl = useImagePreviewUrl(file);

  if (!previewUrl) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center gap-1 p-2 text-center">
        <Icon className="h-5 w-5 text-[var(--on-surface-variant)]" />
        <span className="line-clamp-2 text-label-sm text-[var(--on-surface)]">{file.name}</span>
      </div>
    );
  }

  return (
    <img
      alt={`Preview of ${file.name}`}
      className="h-full min-h-0 w-full object-cover grayscale"
      src={previewUrl}
    />
  );
}

function useImagePreviewUrl(file: File) {
  return useMemo(() => URL.createObjectURL(file), [file]);
}
