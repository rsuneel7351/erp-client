import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-(--text-primary) mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--text-muted)">
              {leftIcon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={twMerge(
              clsx(
                'flex h-10 w-full rounded-md border border-(--bg-border) bg-(--bg-surface) px-3 py-2 text-sm text-(--text-primary) file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-danger focus-visible:ring-danger',
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-(--text-muted)">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
