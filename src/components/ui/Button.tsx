import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent-400) disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 'bg-(--color-surface) text-white border border-(--color-surface-border) hover:bg-(--color-surface-hover) hover:border-(--color-accent-500) hover:shadow-[0_0_15px_rgba(191,0,255,0.4)] backdrop-blur-md',
        primary: 'bg-gradient-to-r from-(--color-accent-500) to-(--color-accent-400) text-white shadow-[0_0_15px_rgba(191,0,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:scale-[1.02]',
        destructive: 'bg-red-500/20 text-red-200 border border-red-500/50 hover:bg-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]',
        outline: 'border border-(--color-surface-border) bg-transparent hover:bg-(--color-surface-hover) text-gray-200 hover:border-(--color-accent-400)',
        secondary: 'bg-(--color-surface-active) text-gray-200 hover:bg-(--color-surface-hover)',
        ghost: 'hover:bg-(--color-surface) text-gray-300 hover:text-white',
        link: 'text-(--color-accent-400) underline-offset-4 hover:underline hover:text-(--color-accent-500)',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  className,
  variant,
  size,
  isLoading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(clsx(buttonVariants({ variant, size, className })))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
