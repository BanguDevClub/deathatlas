import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  flag?: string;
  badge?: string;
  subtext?: string;
  icon?: React.ReactNode;
  group?: string;
}

export interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  disabled?: boolean;
  prefixIcon?: React.ReactNode;
  size?: "sm" | "default" | "lg";
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchable = true,
  className,
  triggerClassName,
  dropdownClassName,
  disabled = false,
  prefixIcon,
  size = "default",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter((opt) => {
    const term = searchTerm.toLowerCase();
    return (
      opt.label.toLowerCase().includes(term) ||
      opt.value.toLowerCase().includes(term) ||
      (opt.subtext && opt.subtext.toLowerCase().includes(term)) ||
      (opt.group && opt.group.toLowerCase().includes(term))
    );
  });

  const sizeClasses = {
    sm: "h-8 text-xs px-2.5 py-1",
    default: "h-9 text-xs px-3 py-1.5",
    lg: "h-10 text-sm px-4 py-2",
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded-lg border border-input bg-card/90 backdrop-blur text-foreground font-medium shadow-sm transition-all hover:bg-accent/70 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size],
          isOpen && "ring-2 ring-primary/40 border-primary",
          triggerClassName
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          {prefixIcon && (
            <span className="text-muted-foreground shrink-0">{prefixIcon}</span>
          )}
          {selectedOption ? (
            <div className="flex items-center gap-2 truncate">
              {selectedOption.flag && (
                <span
                  className="text-base leading-none shrink-0"
                  role="img"
                  aria-label="Country Flag"
                >
                  {selectedOption.flag}
                </span>
              )}
              {selectedOption.icon && (
                <span className="shrink-0">{selectedOption.icon}</span>
              )}
              <span className="truncate font-semibold">
                {selectedOption.label}
              </span>
              {selectedOption.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground shrink-0 ml-2 transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {/* Dropdown Surface */}
      {isOpen && (
        <div
          className={cn(
            "absolute left-0 right-0 mt-1.5 max-h-72 w-full rounded-xl border border-border bg-card shadow-2xl p-1.5 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100",
            dropdownClassName
          )}
          role="listbox"
        >
          {/* Search Field */}
          {searchable && (
            <div className="relative p-1 border-b border-border/50 pb-2 mb-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-input/60 bg-muted/40 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          )}

          {/* Options list */}
          <div className="overflow-y-auto max-h-56 flex flex-col gap-0.5 pr-0.5 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground font-mono">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer",
                      isSelected
                        ? "bg-primary/15 text-primary font-semibold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.flag && (
                        <span
                          className="text-base leading-none shrink-0"
                          role="img"
                          aria-label="Country Flag"
                        >
                          {opt.flag}
                        </span>
                      )}
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                      {opt.subtext && (
                        <span className="text-[10px] text-muted-foreground truncate">
                          ({opt.subtext})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {opt.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="size-3.5 text-primary" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
