import * as React from "react"

// Import the reusable input component from Base UI.
import { Input as InputPrimitive } from "@base-ui/react/input"

// Utility function for combining Tailwind CSS classes.
import { cn } from "@/lib/utils"

// Reusable input field used throughout the CRM.
// Accepts standard HTML input properties, such as type, placeholder and disabled.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      // Determines the input type, such as text, number or email.
      type={type}

      // Identifies this element for styling and component organisation.
      data-slot="input"

      // Apply the standard input styling and any additional custom classes.
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}

      // Pass remaining input properties to the Base UI component.
      {...props}
    />
  )
}

export { Input }