"use client";

import { useState } from "react";

export function DeleteButton({
  onConfirm,
  label = "Delete",
  confirmText = "Are you sure? This cannot be undone.",
}: {
  onConfirm: () => Promise<void> | void;
  label?: string;
  confirmText?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <form
        action={async () => {
          await onConfirm();
        }}
        className="flex items-center gap-2"
      >
        <span className="font-sans text-[12px] text-red-700">{confirmText}</span>
        <button
          type="submit"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-white bg-red-600 px-4 py-2 hover:bg-red-700 transition-colors"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-2 hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-red-600 border border-red-300 px-5 py-2.5 hover:bg-red-50 transition-colors"
    >
      {label}
    </button>
  );
}
