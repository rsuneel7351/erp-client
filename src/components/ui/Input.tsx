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
          <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-(--color-accent-400) transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={twMerge(
              clsx(
                'flex h-11 w-full rounded-lg border border-(--color-surface-border) bg-(--color-surface) px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 backdrop-blur-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-accent-400) focus-visible:border-(--color-accent-400) focus-visible:bg-(--color-surface-active) disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-inner',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500',
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 group-focus-within:text-(--color-accent-400) transition-colors">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
