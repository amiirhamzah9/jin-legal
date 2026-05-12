"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createTeamMember,
  updateTeamMember,
  type TeamFormState,
} from "@/app/admin/team/actions";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

const INITIAL: TeamFormState = { status: "idle" };

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

function SaveButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <Button variant="gold" type="submit" disabled={pending} className="px-9 py-3.5">
      {pending ? "Saving…" : mode === "create" ? "Create Team Member" : "Save Changes"}
    </Button>
  );
}

export function TeamForm({
  mode,
  member,
}: {
  mode: "create" | "edit";
  member?: TeamMember;
}) {
  const boundAction =
    mode === "create" ? createTeamMember : updateTeamMember.bind(null, member!.id);
  const [state, formAction] = useFormState<TeamFormState, FormData>(boundAction, INITIAL);

  const practiceAreasInput = (member?.practice_areas ?? []).join(", ");

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={member?.name}
            className={FIELD_BASE}
          />
        </div>
        <div>
          <label
            htmlFor="credentials"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Credentials
          </label>
          <input
            id="credentials"
            name="credentials"
            type="text"
            defaultValue={member?.credentials ?? ""}
            placeholder="e.g. S.H."
            className={FIELD_BASE}
          />
        </div>
        <div>
          <label
            htmlFor="role"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Role *
          </label>
          <input
            id="role"
            name="role"
            type="text"
            required
            defaultValue={member?.role}
            placeholder="e.g. Managing Partner"
            className={FIELD_BASE}
          />
        </div>
        <div>
          <label
            htmlFor="slug"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={member?.slug ?? ""}
            placeholder="auto-generated from name if blank"
            className={FIELD_BASE}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="bio"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={member?.bio ?? ""}
          placeholder="Short professional bio"
          className={FIELD_BASE}
        />
      </div>

      <div>
        <label
          htmlFor="photo_url"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Photo URL
        </label>
        <input
          id="photo_url"
          name="photo_url"
          type="url"
          defaultValue={member?.photo_url ?? ""}
          placeholder="https://..."
          className={FIELD_BASE}
        />
        <p className="font-sans text-[11px] text-ink-muted mt-2">
          Tip: upload to the{" "}
          <a
            href="https://supabase.com/dashboard/project/ymerojltkwjauqhdhnzu/storage/buckets/team-photos"
            target="_blank"
            rel="noreferrer"
            className="text-gold hover:underline"
          >
            team-photos bucket
          </a>{" "}
          in Supabase, then paste the public URL here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label
            htmlFor="practice_group"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Practice Group
          </label>
          <select
            id="practice_group"
            name="practice_group"
            defaultValue={member?.practice_group ?? ""}
            className={FIELD_BASE}
          >
            <option value="">—</option>
            <option value="corporate-business">Corporate & Business</option>
            <option value="litigation">Litigation</option>
            <option value="specialties">Specialties</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="practice_areas"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Practice Area Slugs (comma-separated)
          </label>
          <input
            id="practice_areas"
            name="practice_areas"
            type="text"
            defaultValue={practiceAreasInput}
            placeholder="business-corporate-law, intellectual-property"
            className={FIELD_BASE}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            min="0"
            defaultValue={member?.display_order ?? 0}
            className={FIELD_BASE}
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer pt-7">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={member?.is_active ?? true}
            className="w-4 h-4 accent-gold"
          />
          <span className="font-sans text-[11px] font-medium tracking-wide text-ink">
            Active (visible on /team)
          </span>
        </label>
      </div>

      <div className="pt-5 border-t border-ivory-dark">
        <SaveButton mode={mode} />
      </div>
    </form>
  );
}
