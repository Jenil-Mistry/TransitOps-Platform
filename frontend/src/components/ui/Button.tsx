import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] disabled:pointer-events-none disabled:opacity-50 transition-colors uppercase tracking-wider",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand-hover)] border border-[var(--color-brand-foreground)]",
        destructive:
          "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90 border border-[var(--color-danger)]/20",
        outline:
          "border-2 border-[var(--color-border-strong)] bg-transparent hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] text-[var(--color-text-primary)]",
        secondary:
          "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border)]",
        ghost: "hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] text-[var(--color-text-muted)]",
        link: "text-[var(--color-brand)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-[var(--radius-sm)] px-3 text-xs",
        lg: "h-12 rounded-[var(--radius-sm)] px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export default Button
