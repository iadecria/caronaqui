import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-sm',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/80 shadow-sm',
        outline:
          'border-2 border-border bg-background hover:bg-muted active:bg-muted/80 text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
        ghost:
          'hover:bg-muted active:bg-muted/80 text-foreground',
        link: 'text-primary underline-offset-4 hover:underline active:opacity-70',
        // Nova variante para botoes nativos mobile
        native:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-lg shadow-primary/25',
      },
      size: {
        default: 'h-11 px-5 py-2.5 rounded-xl',
        sm: 'h-9 rounded-lg gap-1.5 px-4 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base',
        xl: 'h-14 rounded-2xl px-8 text-base',
        icon: 'size-10 rounded-xl',
        'icon-sm': 'size-9 rounded-lg',
        'icon-lg': 'size-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
