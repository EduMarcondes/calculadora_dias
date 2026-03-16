import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("w-full rounded-lg border px-4 py-3 text-sm", {
  variants: {
    variant: {
      default: "bg-card text-card-foreground",
      destructive: "border-destructive/30 bg-destructive/10 text-destructive"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

const Alert = ({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) => (
  <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
);

const AlertTitle = ({ className, ...props }: React.ComponentProps<"h5">) => (
  <h5 className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />
);

const AlertDescription = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("text-sm opacity-90", className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription };
