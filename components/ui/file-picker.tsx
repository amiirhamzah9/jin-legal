"use client";

import { useRef, useState } from "react";

export function FilePicker({
  id,
  name,
  accept,
  required,
  chooseLabel,
  emptyLabel,
}: {
  id: string;
  name: string;
  accept?: string;
  required?: boolean;
  chooseLabel: string;
  emptyLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string>("");

  return (
    <div className="flex items-center gap-4">
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        required={required}
        className="sr-only"
        onChange={(e) => setFilename(e.currentTarget.files?.[0]?.name ?? "")}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="bg-forest text-white font-sans font-semibold text-[10px] tracking-[2px] uppercase px-5 py-2.5 hover:bg-forest-deep transition-colors cursor-pointer"
      >
        {chooseLabel}
      </button>
      <span className="font-sans text-[13px] text-ink-muted truncate">
        {filename || emptyLabel}
      </span>
    </div>
  );
}
