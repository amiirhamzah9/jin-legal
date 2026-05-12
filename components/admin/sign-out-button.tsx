"use client";

import { signOutAction } from "@/app/admin/login/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-white/55 hover:text-gold transition-colors"
      >
        Sign Out
      </button>
    </form>
  );
}
