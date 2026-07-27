type ButtonProps = {
  children: React.ReactNode;

  variant?: "primary" | "secondary";

  fullWidth?: boolean;

  onClick?: () => void;

  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,

  variant = "primary",

  fullWidth = false,

  type = "button",

  onClick,
}: ButtonProps) {
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",

    secondary:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
  };

  const width = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-lg
        px-6
        py-3
        shadow-sm 
        hover:shadow-md
        font-medium
        transition
        duration-200
        ${width}
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
}
