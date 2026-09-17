type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  titleColorClassName?: string; // ej: "text-emerald-600 dark:text-emerald-400"
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  titleColorClassName = "text-zinc-950 dark:text-white",
}: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-600">
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-2 font-heading text-3xl font-black tracking-tight sm:text-4xl ${titleColorClassName}`}
      >
        {title}
      </h2>
      {description && <p className="mt-3 text-zinc-600">{description}</p>}
    </div>
  );
}
