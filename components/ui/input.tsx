import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - native mobile feel
        'h-11 w-full min-w-0 rounded-xl border bg-muted/50 px-4 py-2.5 text-base transition-all duration-200 outline-none',
        // Text styles
        'text-foreground placeholder:text-muted-foreground/60',
        // Selection
        'selection:bg-primary selection:text-primary-foreground',
        // Border
        'border-border/50',
        // Focus state - subtle ring
        'focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background',
        // File input
        'file:text-foreground file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // Invalid
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        // Dark mode
        'dark:bg-input/30',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
