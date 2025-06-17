import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

type InputProps = React.ComponentProps<"input"> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  name?: string;
};

function Input({
  className,
  type,
  leftIcon,
  rightIcon,
  label,
  name,
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-3 bottom-1.5 -translate-y-1/2 text-neutral-60 pointer-events-none">
          {leftIcon}
        </div>
      )}
      <div className="grid w-full items-center gap-2">
        {label && (
          <Label className="text-neutral-70 font-normal" htmlFor={name}>
            {label}
          </Label>
        )}
        <input
          type={type}
          name={name}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-neutral-50 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-lg border bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            leftIcon ? "pl-12" : "",
            rightIcon ? "pr-12" : "",
            className
          )}
          {...props}
        />
      </div>
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-60 pointer-events-none">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

export { Input };
