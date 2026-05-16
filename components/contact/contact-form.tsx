"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { submitContactForm, type ContactFormState } from "@/app/[locale]/contact/actions";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FilePicker } from "@/components/ui/file-picker";

const INITIAL: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("Contact");
  return (
    <Button variant="gold" type="submit" disabled={pending} className="px-9 py-4">
      {pending ? t("sending") : t("sendButton")}
    </Button>
  );
}

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

export function ContactForm({
  practiceAreaOptions,
}: {
  practiceAreaOptions: { slug: string; title: string }[];
}) {
  const searchParams = useSearchParams();
  const presetSubject = searchParams.get("subject") ?? "";
  const [state, formAction] = useFormState(submitContactForm, INITIAL);
  const t = useTranslations("Contact");

  return (
    <div>
      <Eyebrow className="mb-5">{t("tellUsEyebrow")}</Eyebrow>
      <h2 className="font-serif text-[28px] font-light text-forest leading-tight mb-10">
        {t("sendMessage")}
      </h2>
      {state.status === "success" ? (
        <div className="border-l-2 border-gold bg-gold/5 p-7">
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-3">
            {t("messageSent")}
          </div>
          <p className="font-sans text-[14px] font-light text-ink leading-[1.7]">
            {state.message}
          </p>
        </div>
      ) : (
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
                {t("name")}
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
            <div>
              <label
                htmlFor="company"
                className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
              >
                {t("company")}
              </label>
              <input id="company" name="company" type="text" className={FIELD_BASE} />
            </div>
          </div>
          <div>
            <label
              htmlFor="subject"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              {t("subject")}
            </label>
            <select
              id="subject"
              name="subject"
              defaultValue={presetSubject}
              className={FIELD_BASE}
            >
              <option value="">{t("generalInquiry")}</option>
              {practiceAreaOptions.map((area) => (
                <option key={area.slug} value={area.title}>
                  {area.title}
                </option>
              ))}
              {presetSubject &&
                !practiceAreaOptions.find((a) => a.title === presetSubject) && (
                  <option value={presetSubject}>{presetSubject}</option>
                )}
            </select>
          </div>
          <div>
            <label
              htmlFor="message"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              {t("message")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className={FIELD_BASE}
            />
          </div>
          <div>
            <label
              htmlFor="attachment"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              {t("attachment")}
            </label>
            <FilePicker
              id="attachment"
              name="attachment"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              chooseLabel={t("chooseFile")}
              emptyLabel={t("noFileChosen")}
            />
            <p className="font-sans text-[11px] text-ink-muted mt-2">
              {t("attachmentHelp")}
            </p>
          </div>
          <SubmitButton />
        </form>
      )}
    </div>
  );
}
