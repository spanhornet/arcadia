"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-lg",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
Avatar.displayName = "Avatar"

export { Avatar }
