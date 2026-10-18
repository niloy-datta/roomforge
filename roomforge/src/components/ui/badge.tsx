import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'secondary' | 'accent' | 'outline' | 'sage';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-forest text-sand-50 shadow-sm',
  secondary: 'border-transparent bg-sand-200 text-charcoal',
  accent: 'border-transparent bg-clay-500 text-white',
  outline: 'border-sand-300 text-forest bg-white/70',
  sage: 'border-sage-200 bg-sage-50 text-sage-800',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-sage-400',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
