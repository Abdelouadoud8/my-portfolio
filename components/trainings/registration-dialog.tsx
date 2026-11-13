"use client";

import { useRef } from "react";
import { ui, type Locale } from "@/lib/i18n";
import { EVENTS, trackEvent } from "@/lib/analytics";

type RegistrationDialogProps = {
  trainingId: string;
  steps: string[];
  locale?: Locale;
};

// "كيفاش تسجل": an outlined button under the sessions that opens the registration steps in a popup
// (native <dialog>: Esc, the close button or a click outside closes it).
export default function RegistrationDialog({ trainingId, steps, locale = "ar" }: RegistrationDialogProps) {
  const tt = ui[locale].training;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    trackEvent(EVENTS.trainingRegistrationHelpClick, { training: trainingId });
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-white px-4 py-3 font-bold text-primary transition-colors hover:border-primary hover:bg-primary-50"
      >
        <span
          aria-hidden
          className="flex size-6 items-center justify-center rounded-full bg-primary-50 text-sm"
        >
          ?
        </span>
        {tt.registration}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="registration-dialog-title"
        onClick={(event) => {
          // A click on the backdrop lands on the <dialog> itself, not on its content
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white p-0 text-neutral-100 shadow-[0_20px_60px_color-mix(in_srgb,var(--color-primary)_20%,transparent)] backdrop:bg-neutral-100/50"
      >
        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="registration-dialog-title" className="text-xl font-bold">
              {tt.registration}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label={tt.close}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-70 transition-colors hover:bg-neutral-5 hover:text-neutral-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          {steps.length > 0 ? (
            <ol className="flex flex-col gap-3">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="leading-7">{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm leading-6 text-neutral-70">{tt.registrationSoon}</p>
          )}
        </div>
      </dialog>
    </>
  );
}
