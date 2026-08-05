type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-heading text-3xl font-black tracking-tight text-zinc-950 dark:text-white  sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-zinc-600  dark:text-zinc-300">{description}</p>
      )}
    </div>
  );
}
