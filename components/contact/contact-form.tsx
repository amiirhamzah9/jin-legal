"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";
import { PRACTICE_AREAS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/eyebrow";

const INITIAL: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase px-9 py-4 hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Sending…" : "Send Message"}
    </button>
  );
}

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

export function ContactForm() {
  const searchParams = useSearchParams();
  const presetSubject = searchParams.get("subject") ?? "";
  const [state, formAction] = useFormState(submitContactForm, INITIAL);

  return (
    <div>
      <Eyebrow className="mb-5">Tell Us About Your Matter</Eyebrow>
      <h2 className="font-serif text-[28px] font-light text-forest leading-tight mb-10">
        Send Us a Message
      </h2>
      {state.status === "success" ? (
        <div className="border-l-2 border-gold bg-gold/5 p-7">
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-3">
            Message Sent
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
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="name"
                className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
              >
                Name *
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
                htmlFor="company"
                className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
              >
                Company
              </label>
              <input id="company" name="company" type="text" className={FIELD_BASE} />
            </div>
          </div>
          <div>
            <label
              htmlFor="subject"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              defaultValue={presetSubject}
              className={FIELD_BASE}
            >
              <option value="">General Inquiry</option>
              {PRACTICE_AREAS.map((area) => (
                <option key={area.slug} value={area.title}>
                  {area.title}
                </option>
              ))}
              {presetSubject &&
                !PRACTICE_AREAS.find((a) => a.title === presetSubject) && (
                  <option value={presetSubject}>{presetSubject}</option>
                )}
            </select>
          </div>
          <div>
            <label
              htmlFor="message"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className={FIELD_BASE}
            />
          </div>
          <SubmitButton />
        </form>
      )}
    </div>
  );
}
