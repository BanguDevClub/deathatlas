import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onClear?: () => void;
  inputSize?: "sm" | "default" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      className,
      type,
      prefixIcon,
      suffixIcon,
      onClear,
      value,
      inputSize = "default",
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8 text-xs px-2.5",
      default: "h-9 text-xs px-3",
      lg: "h-10 text-sm px-4",
    };

    return (
      <div className="relative flex items-center w-full">
        {prefixIcon && (
          <span className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
            {prefixIcon}
          </span>
        )}
        <input
          type={type}
          value={value}
          className={cn(
            "flex w-full rounded-lg border border-input bg-card/90 px-3 py-1 font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[inputSize],
            prefixIcon && "pl-9",
            (suffixIcon || (onClear && value)) && "pr-8",
            className
          )}
          ref={ref}
          {...props}
        />
        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            aria-label="Clear input"
          >
            <X className="size-3" />
          </button>
        )}
        {suffixIcon && !onClear && (
          <span className="absolute right-3 flex items-center pointer-events-none text-muted-foreground">
            {suffixIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
