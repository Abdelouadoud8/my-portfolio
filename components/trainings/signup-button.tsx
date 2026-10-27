import { EVENTS, eventAttributes } from "@/lib/analytics";

export default function SignupButton({
  trainingId,
  href,
  location,
}: {
  trainingId: string;
  href?: string;
  // "hero" or "bottom": which of the two buttons was clicked
  location: string;
}) {
  const className =
    "flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 font-semibold text-white";

  if (!href) {
    // No sign-up form yet: same button, not clickable
    return (
      <span className={`${className} cursor-default opacity-60`}>التسجيل يتفتح قريبا</span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-600`}
      {...eventAttributes(EVENTS.trainingSignupClick, { training: trainingId, location })}
    >
      سجل في الدورة
    </a>
  );
}
