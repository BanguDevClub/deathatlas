import React, { useEffect, useState, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";

export type ThemeOption =
  "dark" | "light" | "latte" | "frappe" | "macchiato" | "mocha";

interface ThemeMeta {
  id: ThemeOption;
  label: string;
  category: "Standard" | "Catppuccin";
  bg: string;
  accent: string;
  text: string;
}

const THEMES: ThemeMeta[] = [
  {
    id: "dark",
    label: "Midnight Dark",
    category: "Standard",
    bg: "#090d16",
    accent: "#38bdf8",
    text: "#f1f5f9",
  },
  {
    id: "light",
    label: "Pure Light",
    category: "Standard",
    bg: "#ffffff",
    accent: "#0284c7",
    text: "#0f172a",
  },
  {
    id: "latte",
    label: "Catppuccin Latte",
    category: "Catppuccin",
    bg: "#eff1f5",
    accent: "#8839ef",
    text: "#4c4f69",
  },
  {
    id: "frappe",
    label: "Catppuccin Frappé",
    category: "Catppuccin",
    bg: "#303446",
    accent: "#ca9ee6",
    text: "#c6d0f5",
  },
  {
    id: "macchiato",
    label: "Catppuccin Macchiato",
    category: "Catppuccin",
    bg: "#24273a",
    accent: "#c6a0f6",
    text: "#cad3f5",
  },
  {
    id: "mocha",
    label: "Catppuccin Mocha",
    category: "Catppuccin",
    bg: "#1e1e2e",
    accent: "#cba6f7",
    text: "#cdd6f4",
  },
];

export const ThemeSelector: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>("dark");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("deathatlas-theme") as ThemeOption;
    if (saved && THEMES.some((t) => t.id === saved)) {
      setCurrentTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const defaultTheme = "dark";
      setCurrentTheme(defaultTheme);
      document.documentElement.setAttribute("data-theme", defaultTheme);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectTheme = (theme: ThemeOption) => {
    setCurrentTheme(theme);
    localStorage.setItem("deathatlas-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    setIsOpen(false);
  };

  const activeThemeMeta =
    THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/60 backdrop-blur text-card-foreground text-xs font-medium hover:bg-accent transition-all cursor-pointer shadow-sm"
        aria-label="Change Theme"
        title="Theme Selector (6 themes including Catppuccin variants)"
      >
        <span
          className="size-3.5 rounded-full border border-border/80 shadow-inner flex-shrink-0"
          style={{ backgroundColor: activeThemeMeta.accent }}
        />
        <span className="hidden sm:inline-block max-w-[110px] truncate">
          {activeThemeMeta.label}
        </span>
        <ChevronDown className="size-3.5 opacity-60 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Color Themes
          </div>
          <div className="flex flex-col gap-0.5">
            {THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => selectTheme(theme.id)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-primary/15 text-primary font-semibold"
                      : "text-card-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="size-4 rounded-full border border-border flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: theme.bg }}
                    >
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    <span>{theme.label}</span>
                  </div>
                  {isSelected && <Check className="size-3.5 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
