import { useRef, useState } from "react";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPT = ".xtf,.jpg,.jpeg,.png";

export function UploadDropzone({
  onFile,
  compact = false,
}: {
  onFile: (file: File) => void;
  compact?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files);
      }}
      className={cn(
        "rounded-xl border border-dashed transition-colors",
        dragging ? "border-primary bg-primary/8" : "border-primary/35 bg-primary/[0.03]",
      )}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl text-center",
          compact ? "px-6 py-16" : "px-6 py-10",
        )}
      >
        <UploadCloud className={cn("text-primary", compact ? "h-12 w-12" : "h-10 w-10")} />
        <span className="text-sm text-foreground">Drag &amp; drop sonar image logs here</span>
        <span className="text-sm text-muted-foreground">or click to browse</span>
        <span className="mt-1 text-xs text-muted-foreground/80">
          Supports: .xtf, .jpg, .png (Max 200MB)
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        aria-label="Choose sonar scan file"
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  );
}

export function UploadedFileRow({
  filename,
  meta,
  progress,
  done,
}: {
  filename: string;
  meta: string;
  progress: number;
  done: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-2/60 px-3 py-2.5">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <FileText className="h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="truncate text-sm">{filename}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">{meta}</span>
          {done ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <span className="text-primary">{progress}%</span>
          )}
        </div>
      </div>
      {!done && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
