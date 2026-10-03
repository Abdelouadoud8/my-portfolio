// Small red uppercase label + title, like the portfolio's section headers but compact
export default function SectionTitle({
  label,
  title,
}: {
  label: string;
  title?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-sm font-bold uppercase tracking-wide text-primary">{label}</h2>
      {title && <p className="text-2xl font-semibold text-neutral-100">{title}</p>}
    </div>
  );
}
