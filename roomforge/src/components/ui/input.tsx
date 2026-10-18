import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  suffix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, suffix, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm text-charcoal transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 disabled:cursor-not-allowed disabled:opacity-50',
            suffix && 'pr-10',
            error && 'border-red-500 focus-visible:ring-red-400 bg-red-50/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
            {suffix}
          </span>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
