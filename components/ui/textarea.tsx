import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

type TextAreaProps = React.ComponentProps<"textarea"> & {
  label?: string;
  name?: string;
};

function Textarea({ className, label, name, ...props }: TextAreaProps) {
  return (
    <div className={cn("grid items-center gap-2", className)}>
      {label && (
        <Label className="text-neutral-70 font-normal" htmlFor={name}>
          {label}
        </Label>
      )}
      <textarea
        data-slot="textarea"
        className="border-input bg-white placeholder:text-neutral-50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-28 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        name={name}
        {...props}
      />
    </div>
  );
}

export { Textarea };
