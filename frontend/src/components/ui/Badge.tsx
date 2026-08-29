import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-sm)] border px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]",
        secondary:
          "border-transparent bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]",
        destructive:
          "border-transparent bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/80",
        outline: "text-[var(--color-text-primary)] border-[var(--color-border-strong)]",
        brand: "border-transparent bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand-hover)]",
        success: "border-transparent bg-[var(--color-success)] text-[#000] hover:bg-[var(--color-success)]/80",
        warning: "border-transparent bg-[var(--color-warning)] text-[#000] hover:bg-[var(--color-warning)]/80",
        info: "border-transparent bg-[var(--color-info)] text-white hover:bg-[var(--color-info)]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
