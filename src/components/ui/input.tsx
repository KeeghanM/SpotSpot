import * as React from 'react'

import { cn } from '@/lib/utils'

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}
const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground flex h-11 w-full min-w-0 rounded-xl border-2 border-pink-200 bg-pink-50/30 px-4 py-2 text-base shadow-sm transition-all duration-300 outline-none selection:bg-purple-200 selection:text-purple-800 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-pink-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-pink-900/10',
        'focus-visible:border-purple-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-purple-200',
        'aria-invalid:border-pink-400 aria-invalid:ring-pink-300 dark:aria-invalid:ring-pink-400',
        className,
      )}
      {...props}
    />
  )
})

export { Input }
