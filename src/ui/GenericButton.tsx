"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import { GenericButtonProps } from "@/types/GenericButtonProps";

// Estilos por variante
const VARIANT_STYLES = {
  primary: {
    button: `secondary-gradient shadow-custom text-[var(--foreground)] hover:outline-0 active:scale-90`,
    span: `h-fit bg-[var(--background)] hover:bg-transparent`,
    icon: `w-[40px] h-full bg-transparent`,
  },
  secondary: {
    button: `secondary-button relative z-10 bg-[var(--background)] text-[var(--foreground)] flex justify-center items-center border-0 p-[0.75rem] gap-[0.75rem]`,
    span: `bg-transparent`,
    icon: `w-[40px] h-full bg-transparent`,
  },
  jump: {
    button:
      "flex flex-row items-center relative border-[1px] border-blue-800 bg-blue-400 overflow-hidden group",
    span: "hidden md:inline-flex absolute text-white font-semibold transition-all duration-400 group-hover:text-transparent",
    icon: "flex items-center justify-center w-10 h-full bg-blue-500 text-white transition-all duration-300 md:absolute md:right-0 md:w-10 md:h-full group-hover:md:right-0 group-hover:md:w-full",
  },
};

// Estilos por tamaño
const SIZE_STYLES = {
  small: {
    button: "rounded-lg w-8 md:w-[8rem] h-8 md:h-12 text-[0.75rem]",
    span: "p-2 md:p-4 rounded-lg",
  },
  medium: {
    button: "rounded-lg min-w-[10rem] h-[3.5rem] text-[1rem]",
    span: "p-[0.75rem] rounded-lg",
  },
  large: {
    button: "rounded-lg min-w-[12rem] h-[4rem] text-[1.5rem]",
    span: "p-4 rounded-lg",
  },
};

const BASE_BUTTON_CLASSES = `border-0 leading-4 max-w-full p-[3px] no-underline select-none whitespace-nowrap cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`;

const BASE_SPAN_CLASSES = `w-full h-full transition-all duration-300 font-medium`;

const GenericButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  GenericButtonProps
>(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      href,
      onClick,
      disabled = false,
      loading = false,
      icon,
      className = "",
      spanClassName = "",
      iconClassName = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const buttonClasses = clsx(
      BASE_BUTTON_CLASSES,
      VARIANT_STYLES[variant].button,
      SIZE_STYLES[size].button,
      disabled && "disabled:active:scale-100",
      className
    );

    const spanClasses = clsx(
      BASE_SPAN_CLASSES,
      VARIANT_STYLES[variant].span,
      SIZE_STYLES[size].span,
      spanClassName
    );

    const iconClasses = clsx(VARIANT_STYLES[variant].icon, iconClassName);

    const content = (
      <>
        <span className={spanClasses}>{children}</span>
        {icon && <span className={iconClasses}>{icon}</span>}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={buttonClasses}
          onClick={onClick}
          {...(props as Omit<
            React.AnchorHTMLAttributes<HTMLAnchorElement>,
            "ref"
          >)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

GenericButton.displayName = "GenericButton";

export default GenericButton;
