import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm border font-medium text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground border-primary hover:bg-accent-hover dark:bg-primary dark:hover:bg-accent-hover",
        outline: "border-border bg-background text-foreground hover:bg-muted dark:border-dark-border dark:bg-dark-canvas dark:hover:bg-dark-border",
        secondary: "border-secondary bg-secondary text-secondary-foreground hover:opacity-90",
        ghost: "border-transparent hover:bg-muted dark:hover:bg-dark-border",
        destructive: "bg-destructive text-destructive-foreground border-destructive hover:opacity-90",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        default: "px-6 py-3",
        lg: "px-8 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
