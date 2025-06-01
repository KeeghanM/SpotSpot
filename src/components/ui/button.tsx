import { Slot } from '@radix-ui/react-slot'
import {
  cva,
  type VariantProps,
} from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg hover:from-orange-500 hover:to-orange-600 hover:shadow-xl',
        destructive:
          'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg hover:from-pink-500 hover:to-pink-600 hover:shadow-xl focus-visible:ring-pink-300',
        outline:
          'border-2 border-fuchsia-400 bg-white shadow-sm hover:bg-pink-50 hover:border-pink-300 text-pink-700 dark:bg-pink-900/10 dark:border-pink-700 dark:hover:bg-pink-800/20',
        secondary:
          'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg hover:from-purple-500 hover:to-purple-600 hover:shadow-xl',
        accent:
          'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 shadow-sm hover:from-pink-200 hover:to-pink-300',
        ghost:
          'hover:bg-pink-50 hover:text-pink-700 dark:hover:bg-pink-900/20',
        link: 'text-purple-600 underline-offset-4 hover:underline hover:text-purple-700',
      },
      size: {
        default: 'h-10 px-6 py-2 has-[>svg]:px-4',
        sm: 'h-8 rounded-lg gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-12 rounded-xl px-8 has-[>svg]:px-6',
        icon: 'size-10',
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
      className={cn(
        buttonVariants({ variant, size, className }),
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
