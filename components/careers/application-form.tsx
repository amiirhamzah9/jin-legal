"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { submitApplication, type ApplicationFormState } from "@/app/[locale]/careers/[slug]/apply/actions";
import { Button } from "@/components/ui/button";
import { FilePicker } from "@/components/ui/file-picker";

const INITIAL: ApplicationFormState = { status: "idle" };

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("Careers");
  return (
    <Button variant="gold" type="submit" disabled={pending} className="px-9 py-4">
      {pending ? t("submitting") : t("submitButton")}
    </Button>
  );
}

export function ApplicationForm({ slug }: { slug: string }) {
  const action = submitApplication.bind(null, slug);
  const [state, formAction] = useFormState(action, INITIAL);
  const t = useTranslations("Careers");

  if (state.status === "success") {
    return (
      <div className="border-l-2 border-gold bg-gold/5 p-7">
        <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-3">
          {t("applicationReceivedHeading")}
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
            {t("fullName")}
          </label>
          <input id="name" name="name" type="text" required className={FIELD_BASE} />
        </div>
        <div>
          <label
            htmlFor="email"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            {t("email")}
          </label>
          <input id="email" name="email" type="email" required className={FIELD_BASE} />
        </div>
      </div>
      <div>
        <label
          htmlFor="phone"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          {t("phone")}
        </label>
        <input id="phone" name="phone" type="tel" className={FIELD_BASE} />
      </div>
      <div>
        <label
          htmlFor="cv"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          {t("cvResume")}
        </label>
        <FilePicker
          id="cv"
          name="cv"
          accept=".pdf,.doc,.docx"
          required
          chooseLabel={t("chooseFile")}
          emptyLabel={t("noFileChosen")}
        />
        <p className="font-sans text-[11px] text-ink-muted mt-2">
          {t("cvHelp")}
        </p>
      </div>
      <div>
        <label
          htmlFor="cover_letter"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          {t("coverLetter")}
        </label>
        <textarea
          id="cover_letter"
          name="cover_letter"
          rows={6}
          placeholder={t("coverLetterPlaceholder")}
          className={FIELD_BASE}
        />
      </div>
      <SubmitButton />
    </form>
  );
}
