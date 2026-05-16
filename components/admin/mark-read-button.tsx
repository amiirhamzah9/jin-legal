"use client";

import { markLeadRead, markLeadUnread } from "@/app/admin/leads/actions";

export function MarkReadButton({ leadId, isRead }: { leadId: string; isRead: boolean }) {
  return (
    <form action={isRead ? markLeadUnread.bind(null, leadId) : markLeadRead.bind(null, leadId)}>
      <button
        type="submit"
        className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-forest border border-forest px-5 py-2.5 hover:bg-forest hover:text-white transition-colors"
      >
        {isRead ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
      </button>
    </form>
  );
}
