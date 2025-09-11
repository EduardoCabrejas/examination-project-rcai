import { LinkProps } from "next/link";

export type ButtonVariant = "search" | "refresh" | "jump";
export type ButtonSize = "xSmall" | "small" | "medium" | "large";

interface BaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  spanClassName?: string;
  iconClassName?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

// --- ScrollButtonProps ---
export interface ScrollButtonProps extends BaseProps {
  to: string;
  smooth?: boolean;
  duration?: number;
  offset?: number;
  href?: undefined;
  onClick?: never;
}

// --- ButtonProps ---
type ButtonProps = BaseProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "size" | "children" | "type"
  > & {
    href?: undefined;
    to?: undefined;
  };

// --- LinkButtonProps ---
export type LinkButtonProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> &
  LinkProps & {
    href: string;
    to?: undefined;
  };

export type GenericButtonProps =
  | ButtonProps
  | LinkButtonProps
  | ScrollButtonProps;
