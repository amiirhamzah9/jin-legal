"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createCareer,
  updateCareer,
  type CareerFormState,
} from "@/app/admin/careers/actions";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/types";

type Career = Database["public"]["Tables"]["careers"]["Row"];

const INITIAL: CareerFormState = { status: "idle" };

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

function SaveButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <Button variant="gold" type="submit" disabled={pending} className="px-9 py-3.5">
      {pending ? "Menyimpan…" : mode === "create" ? "Buat Lowongan" : "Simpan Perubahan"}
    </Button>
  );
}

export function CareerForm({
  mode,
  career,
}: {
  mode: "create" | "edit";
  career?: Career;
}) {
  const boundAction =
    mode === "create" ? createCareer : updateCareer.bind(null, career!.id);
  const [state, formAction] = useFormState<CareerFormState, FormData>(
    boundAction,
    INITIAL
  );

  return (
    <form action={formAction} className="max-w-[760px] space-y-5">
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

      <div>
        <label
          htmlFor="title"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Judul (English) *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={career?.title}
          className={FIELD_BASE}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Deskripsi (English) *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={10}
          defaultValue={career?.description}
          className={FIELD_BASE}
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="type"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Tipe *
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={career?.type}
            className={FIELD_BASE}
          >
            <option value="">Pilih…</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Kontrak</option>
            <option value="Internship">Magang</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Lokasi
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={career?.location ?? ""}
            className={FIELD_BASE}
          />
        </div>
      </div>

      <div className="pt-8 border-t-2 border-gold/30">
        <div className="font-sans text-[11px] font-bold tracking-[2.5px] uppercase text-gold mb-1">
          Bahasa Indonesia
        </div>
        <p className="font-sans text-[12px] text-ink-muted mb-6">
          Opsional. Kosongkan untuk fallback ke versi English pada{" "}
          <code>/id/careers</code>.
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
              defaultValue={career?.title_id ?? ""}
              placeholder="Terjemahan judul lowongan"
              className={FIELD_BASE}
            />
          </div>

          <div>
            <label
              htmlFor="description_id"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Deskripsi (Bahasa Indonesia)
            </label>
            <textarea
              id="description_id"
              name="description_id"
              rows={10}
              defaultValue={career?.description_id ?? ""}
              placeholder="Terjemahan deskripsi lengkap (Markdown didukung)"
              className={FIELD_BASE}
            />
          </div>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer pt-3 border-t border-ivory-dark">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={career?.is_active ?? true}
          className="w-4 h-4 accent-gold"
        />
        <span className="font-sans text-[11px] font-medium tracking-wide text-ink">
          Aktif (tampil di /careers)
        </span>
      </label>

      <div className="pt-5 border-t border-ivory-dark">
        <SaveButton mode={mode} />
      </div>
    </form>
  );
}
