"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createCareer,
  updateCareer,
  type CareerFormState,
} from "@/app/admin/careers/actions";
import type { Database } from "@/lib/supabase/types";

type Career = Database["public"]["Tables"]["careers"]["Row"];

const INITIAL: CareerFormState = { status: "idle" };

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

function SaveButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase px-9 py-3.5 hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Saving…" : mode === "create" ? "Create Career" : "Save Changes"}
    </button>
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
          Title *
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
          Description *
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
            Type *
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={career?.type}
            className={FIELD_BASE}
          >
            <option value="">Choose…</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Location
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

      <label className="flex items-center gap-3 cursor-pointer pt-3 border-t border-ivory-dark">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={career?.is_active ?? true}
          className="w-4 h-4 accent-gold"
        />
        <span className="font-sans text-[11px] font-medium tracking-wide text-ink">
          Active (visible on /careers)
        </span>
      </label>

      <div className="pt-5 border-t border-ivory-dark">
        <SaveButton mode={mode} />
      </div>
    </form>
  );
}
