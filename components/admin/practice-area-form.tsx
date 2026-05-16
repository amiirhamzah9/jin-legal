"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  updatePracticeArea,
  type PracticeAreaFormState,
} from "@/app/admin/practice-areas/actions";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/types";

type PracticeArea = Database["public"]["Tables"]["practice_areas"]["Row"];

const INITIAL: PracticeAreaFormState = { status: "idle" };

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="gold" type="submit" disabled={pending} className="px-9 py-3.5">
      {pending ? "Saving…" : "Save Changes"}
    </Button>
  );
}

export function PracticeAreaForm({ area }: { area: PracticeArea }) {
  const boundAction = updatePracticeArea.bind(null, area.id);
  const [state, formAction] = useFormState<PracticeAreaFormState, FormData>(
    boundAction,
    INITIAL
  );

  const servicesInput = (area.services ?? []).join("\n");

  return (
    <form action={formAction} className="max-w-[860px] space-y-5">
      {state.status === "error" && state.message && (
        <div className="bg-red-50 border-l-2 border-red-400 px-5 py-3">
          <p className="font-sans text-[13px] text-red-700">{state.message}</p>
        </div>
      )}
      {state.status === "success" && state.message && (
        <div className="bg-gold/10 border-l-2 border-gold px-5 py-3">
          <p className="font-sans text-[13px] text-forest">{state.message}</p>
        </div>
      )}

      <div className="bg-ivory-dark/40 border-l-2 border-gold px-5 py-3">
        <div className="font-sans text-[9px] font-bold tracking-[2px] uppercase text-gold mb-1">
          Slug (read-only)
        </div>
        <div className="font-mono text-[13px] text-ink">{area.slug}</div>
        <p className="font-sans text-[11px] text-ink-muted mt-1">
          Slug cannot be changed — it&apos;s tied to the public URL{" "}
          <code>/practice-areas/{area.slug}</code>.
        </p>
      </div>

      <div>
        <label
          htmlFor="title"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Title (English) *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={area.title}
          className={FIELD_BASE}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Short Description (English) *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={2}
          defaultValue={area.description}
          placeholder="One-sentence summary shown on listing card and detail hero"
          className={FIELD_BASE}
        />
      </div>

      <div>
        <label
          htmlFor="full_content"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Full Content English (Our Approach paragraph)
        </label>
        <textarea
          id="full_content"
          name="full_content"
          rows={8}
          defaultValue={area.full_content ?? ""}
          placeholder="Detailed explanation shown on the practice area detail page"
          className={FIELD_BASE}
        />
      </div>

      <div>
        <label
          htmlFor="services"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Services English (one per line)
        </label>
        <textarea
          id="services"
          name="services"
          rows={6}
          defaultValue={servicesInput}
          placeholder={"Service 1\nService 2\nService 3"}
          className={`${FIELD_BASE} font-mono`}
        />
      </div>

      <div className="pt-8 border-t-2 border-gold/30">
        <div className="font-sans text-[11px] font-bold tracking-[2.5px] uppercase text-gold mb-1">
          Bahasa Indonesia
        </div>
        <p className="font-sans text-[12px] text-ink-muted mb-6">
          Opsional. Kosongkan untuk fallback ke versi English pada{" "}
          <code>/id/practice-areas</code>.
        </p>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="title_id"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Judul (Bahasa Indonesia)
            </label>
            <input
              id="title_id"
              name="title_id"
              type="text"
              defaultValue={area.title_id ?? ""}
              placeholder="Terjemahan judul"
              className={FIELD_BASE}
            />
          </div>

          <div>
            <label
              htmlFor="description_id"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Deskripsi Singkat (Bahasa Indonesia)
            </label>
            <textarea
              id="description_id"
              name="description_id"
              rows={2}
              defaultValue={area.description_id ?? ""}
              placeholder="Ringkasan satu kalimat untuk listing card dan detail hero"
              className={FIELD_BASE}
            />
          </div>

          <div>
            <label
              htmlFor="full_content_id"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Konten Lengkap (Bahasa Indonesia)
            </label>
            <textarea
              id="full_content_id"
              name="full_content_id"
              rows={8}
              defaultValue={area.full_content_id ?? ""}
              placeholder="Penjelasan detail untuk halaman detail practice area"
              className={FIELD_BASE}
            />
          </div>

          <div>
            <label
              htmlFor="services_id"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Layanan (Bahasa Indonesia — satu per baris)
            </label>
            <textarea
              id="services_id"
              name="services_id"
              rows={6}
              defaultValue={(area.services_id ?? []).join("\n")}
              placeholder={"Layanan 1\nLayanan 2\nLayanan 3"}
              className={`${FIELD_BASE} font-mono`}
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="display_order"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Display Order
        </label>
        <input
          id="display_order"
          name="display_order"
          type="number"
          min="1"
          defaultValue={area.display_order}
          className={`${FIELD_BASE} max-w-[120px]`}
        />
      </div>

      <div className="pt-5 border-t border-ivory-dark">
        <SaveButton />
      </div>
    </form>
  );
}
