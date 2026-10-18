import * as React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'default' | 'accent' | 'outline' | 'secondary' | 'ghost' | 'link' | 'dark';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-forest text-sand-50 shadow-sm hover:bg-sage-800 hover:shadow',
  accent: 'bg-clay-500 text-white shadow-sm hover:bg-clay-600 hover:shadow',
  outline: 'border border-sand-300 bg-white/80 hover:bg-sand-100 text-charcoal hover:border-sand-400',
  secondary: 'bg-sand-200 text-charcoal hover:bg-sand-300',
  ghost: 'hover:bg-sand-200/70 text-charcoal',
  link: 'text-sage-700 underline-offset-4 hover:underline p-0 h-auto font-normal',
  dark: 'bg-charcoal text-white hover:bg-black',
};

const sizeStyles: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-12 rounded-lg px-6 text-base font-medium',
  icon: 'h-9 w-9 p-0',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
