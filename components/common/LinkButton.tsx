type LinkButtonProps = {
  children: React.ReactNode;

  href: string;

  variant?: "primary" | "secondary";

  fullWidth?: boolean;

  target?: "_blank" | "_self";

  rel?: string;
};

export default function LinkButton({
  children,
  href,
  variant = "primary",
  fullWidth = false,
  target = "_self",
  rel,
}: LinkButtonProps) {
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",

    secondary:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
  };

  const width = fullWidth ? "w-full" : "w-auto";

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-lg
        px-6
        py-3
        font-medium
        transition
        duration-200
        shadow-sm
        hover:shadow-md
        ${width}
        ${variants[variant]}
      `}
    >
      {children}
    </a>
  );
}

