import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "contained" | "outlined" | "text";
type Size = "sm" | "md" | "lg";
type Color = "primary" | "secondary" | "danger" | "disabled";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  color?: Color;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
}

const Button = ({
  children,
  variant = "contained",
  size = "md",
  color = "primary",
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded transition-all ease-in duration-150";

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2",
    lg: "text-base px-6 py-3",
  };

  const variants = {
    contained: {
      primary: "border border-primary bg-primary text-black hover:opacity-85",
      secondary: "border bg-blue-500 text-black hover:opacity-85",
      disabled: "border bg-gray-600 text-white",
      danger: "border border-transparent bg-red-500 text-black hover:opacity-85",
    },
    outlined: {
      primary: "border border-primary text-primary hover:text-black hover:bg-primary",
      secondary:
        "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black",
      disabled: "border border-border text-text-secondary hover:bg-white/10 hover:text-white",
      danger:
        "border border-red-500 text-red-500 hover:bg-red-500 hover:text-black",
    },
    text: {
      primary: "text-primary",
      secondary: "text-blue-500",
      disabled: "text-text-muted",
      danger: "text-red-500",
    },
  };

  return (
    <button
      className={`
        ${base}
        ${sizes[size]}
        ${variants[variant][color]}
        ${fullWidth ? "w-full" : ""}
        ${className}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          {startIcon}
          {children}
          {endIcon}
        </>
      )}
    </button>
  );
};

export default Button;
