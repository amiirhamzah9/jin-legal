"use client";

import { Suspense } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loginAction, type LoginState } from "./actions";

const INITIAL: LoginState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="gold" type="submit" disabled={pending} className="w-full py-4 text-[11px]">
      {pending ? "Memproses…" : "Masuk"}
    </Button>
  );
}

function LoginForm() {
  const [state, formAction] = useFormState(loginAction, INITIAL);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectedFrom") ?? "/admin";

  return (
    <>
      {state.status === "error" && state.message && (
        <div className="bg-red-50 border-l-2 border-red-400 px-5 py-3 mb-6">
          <p className="font-sans text-[13px] text-red-700">{state.message}</p>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div>
          <label
            htmlFor="email"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Kata Sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors"
          />
        </div>
        <SubmitButton />
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-forest-deep flex items-center justify-center px-6">
      <div className="w-full max-w-[420px] bg-white p-12">
        <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-3">
          Admin JIN Legal Counsel
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight mb-10">
          Masuk
        </h1>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
