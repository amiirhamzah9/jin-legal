"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitApplication, type ApplicationFormState } from "@/app/careers/[slug]/apply/actions";
import { Button } from "@/components/ui/button";

const INITIAL: ApplicationFormState = { status: "idle" };

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="gold" type="submit" disabled={pending} className="px-9 py-4">
      {pending ? "Submitting…" : "Submit Application"}
    </Button>
  );
}

export function ApplicationForm({ slug }: { slug: string }) {
  const action = submitApplication.bind(null, slug);
  const [state, formAction] = useFormState(action, INITIAL);

  if (state.status === "success") {
    return (
      <div className="border-l-2 border-gold bg-gold/5 p-7">
        <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-3">
          Application Received
        </div>
        <p className="font-sans text-[14px] font-light text-ink leading-[1.7]">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && state.message && (
        <div className="bg-red-50 border-l-2 border-red-400 px-5 py-3">
          <p className="font-sans text-[13px] text-red-700">{state.message}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Full Name *
          </label>
          <input id="name" name="name" type="text" required className={FIELD_BASE} />
        </div>
        <div>
          <label
            htmlFor="email"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Email *
          </label>
          <input id="email" name="email" type="email" required className={FIELD_BASE} />
        </div>
      </div>
      <div>
        <label
          htmlFor="phone"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Phone
        </label>
        <input id="phone" name="phone" type="tel" className={FIELD_BASE} />
      </div>
      <div>
        <label
          htmlFor="cv"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          CV / Resume *
        </label>
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          required
          className="block w-full text-[13px] text-ink font-sans file:mr-4 file:py-2.5 file:px-5 file:border-0 file:bg-forest file:text-white file:font-semibold file:text-[10px] file:tracking-[2px] file:uppercase hover:file:bg-forest-deep file:cursor-pointer cursor-pointer"
        />
        <p className="font-sans text-[11px] text-ink-muted mt-2">
          PDF, DOC, or DOCX. Max 10 MB.
        </p>
      </div>
      <div>
        <label
          htmlFor="cover_letter"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Cover Letter
        </label>
        <textarea
          id="cover_letter"
          name="cover_letter"
          rows={6}
          placeholder="Tell us why you're a great fit for this role…"
          className={FIELD_BASE}
        />
      </div>
      <SubmitButton />
    </form>
  );
}
