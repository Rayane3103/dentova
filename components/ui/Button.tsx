import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "light";
type ButtonSize = "xs" | "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-dentova-magenta text-white shadow-glow hover:bg-dentova-violet active:brightness-95",
  secondary:
    "bg-dentova-violet text-white shadow-card hover:bg-dentova-navy-950",
  outline:
    "border border-dentova-lavender/40 bg-white text-dentova-navy-950 hover:border-dentova-magenta hover:bg-dentova-magenta/5",
  ghost: "text-dentova-navy-700 hover:bg-dentova-navy-50",
  light:
    "border border-white/20 bg-white/10 text-white backdrop-blur hover:border-dentova-magenta/50 hover:bg-white/15"
};

const sizes: Record<ButtonSize, string> = {
  xs: "h-8 px-3 text-xs",
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base"
};

export function buttonClassName({
  className,
  size = "md",
  variant = "primary"
}: {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return cn(
    "dentova-focus inline-flex items-center justify-center gap-2 rounded-full font-bold transition duration-300",
    sizes[size],
    variants[variant],
    className
  );
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  asChild?: false;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  asChild: true;
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button(props: ButtonProps | LinkButtonProps) {
  if (props.asChild) {
    const { asChild: _asChild, className, size, variant, ...linkProps } = props;
    void _asChild;
    return (
      <Link
        {...linkProps}
        className={buttonClassName({ className, size, variant })}
      />
    );
  }

  const {
    asChild: _asChild,
    className,
    size,
    type = "button",
    variant,
    ...buttonProps
  } = props;
  void _asChild;
  return (
    <button
      {...buttonProps}
      type={type}
      className={buttonClassName({ className, size, variant })}
    />
  );
}
