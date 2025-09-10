import { LinkProps } from "next/link";

export type ButtonVariant = "primary" | "secondary" | "jump";
export type ButtonSize = "small" | "medium" | "large";

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

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size" | "children"> & {
    href?: undefined;
  };

type LinkButtonProps = BaseProps &
  Omit<LinkProps, "children"> & {
    href: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  };

export type GenericButtonProps = ButtonProps | LinkButtonProps;
