import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-h-24 px-3 py-2 rounded-sm border border-border bg-background text-foreground placeholder:text-muted-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed resize-none dark:border-dark-border dark:bg-dark-canvas dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus-visible:border-ring",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
