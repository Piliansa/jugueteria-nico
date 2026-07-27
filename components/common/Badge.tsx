type BadgeProps = {
  children: React.ReactNode;
  variant: "new" | "featured" | "sale";
};

export default function Badge({ children, variant }: BadgeProps) {
  const variants = {
    new: "bg-sky-100 text-sky-700",
    featured: "bg-amber-100 text-amber-700",
    sale: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`
    inline-flex
    self-start
    items-center
    rounded-full
    px-3
    py-1
    text-[11px]
    font-semibold
    tracking-wide
    uppercase
    ${variants[variant]}
  `}
    >
      {children}
    </span>
  );
}
