"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import clsx from "clsx";
import {
  GenericButtonProps,
  LinkButtonProps,
  ScrollButtonProps,
} from "@/types/GenericButtonProps";

// Estilos por variante
const VARIANT_STYLES = {
  search: {
    button: `flex flex-row justify-center items-center border-2 border-blue-400 bg-blue-200 group transition-all duration-300 ease-in-out hover:border-blue-800 disabled:opacity-50`,
    span: `flex items-center justify-center bg-transparent text-black font-semibold`,
    icon: `w-8 h-8 flex items-center justify-center rounded-full text-black transition-all duration-300 ease-in-out group-hover:bg-blue-800 group-hover:text-white`,
  },
  refresh: {
    button: `border-2 border-blue-400 flex flex-row items-center items-center text-sm text-white bg-blue-400 group transition-all duration-300 ease-in-out hover:bg-blue-800 disabled:opacity-50`,
    span: `flex justify-center items-center bg-transparent group-hover:bg-blue-600`,
    icon: `w-12 h-full flex items-center justify-center transition-all duration-300 ease-in-out group-hover:rotate-180`,
  },
  jump: {
    button:
      "flex flex-row items-center relative border-[1px] border-blue-800 bg-blue-400 overflow-hidden group",
    span: "hidden md:inline-flex items-center absolute text-white font-semibold transition-all duration-400 group-hover:text-transparent",
    icon: "flex items-center justify-center w-10 h-full bg-blue-500 text-white transition-all duration-300 md:absolute md:right-0 md:w-10 md:h-full group-hover:md:right-0 group-hover:md:w-full",
  },
};

// Estilos por tamaño
const SIZE_STYLES = {
  xSmall: {
    button: "rounded-lg w-8 md:w-[8rem] h-8 md:h-12",
    span: "text-xs p-2 rounded-lg",
  },
  small: {
    button: "rounded-lg w-[5rem] md:w-[8rem] h-8 md:h-12",
    span: "text-xs p-2 rounded-lg",
  },
  medium: {
    button: "rounded-lg w-[8rem] md:w-[10rem] h-8 md:h-12",
    span: "text-lg p-2 rounded-lg",
  },
  large: {
    button: "rounded-lg min-w-[12rem] h-[4rem] text-[1.5rem]",
    span: "p-4 rounded-lg",
  },
};

const BASE_BUTTON_CLASSES = `border-0 leading-4 max-w-full p-[3px] no-underline select-none whitespace-nowrap cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform duration-150`;

const BASE_SPAN_CLASSES = `w-full h-full transition-all duration-300 font-medium`;

const GenericButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  GenericButtonProps
>(
  (
    {
      children,
      variant = "search",
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
      // React Scroll Props
      to,
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
      variant !== "search" && BASE_SPAN_CLASSES,
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

    // Si tiene 'to' prop, usar react-scroll
    if (to) {
      const {
        smooth = true,
        duration = 500,
        offset = -100,
      } = props as ScrollButtonProps;
      return (
        <ScrollLink
          to={to}
          smooth={smooth}
          duration={duration}
          offset={offset}
          className={buttonClasses}
        >
          {content}
        </ScrollLink>
      );
    }

    // Si es un Link Next.js
    if (href) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { onClick, href: _href, ...linkProps } = props as LinkButtonProps;
      return (
        <Link
          href={href}
          onClick={onClick}
          className={buttonClasses}
          {...linkProps}
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
