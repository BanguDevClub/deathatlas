import React, { useState } from "react";
import { ThemeSelector } from "./ThemeSelector";
import {
  BarChart3,
  Globe2,
  Trophy,
  GitCompare,
  FlaskConical,
  BookOpen,
  Home,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { GithubIcon } from "./icons/GithubIcon";

interface NavbarProps {
  currentPath: string;
}

const NAV_LINKS = [
  { name: "Overview", href: "/deathatlas/", icon: Home },
  { name: "Dashboard", href: "/deathatlas/dashboard", icon: BarChart3 },
  { name: "Continents", href: "/deathatlas/continents", icon: Globe2 },
  { name: "Ranking", href: "/deathatlas/ranking", icon: Trophy },
  { name: "Compare", href: "/deathatlas/compare", icon: GitCompare },
  { name: "Sandbox", href: "/deathatlas/sandbox", icon: FlaskConical },
  { name: "Methodology", href: "/deathatlas/methodology", icon: BookOpen },
];

export const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Normalize path comparison
  const isActive = (href: string) => {
    const cleanHref = href.replace(/\/$/, "");
    const cleanCurrent = currentPath.replace(/\/$/, "");
    if (
      cleanHref === "/deathatlas" &&
      (cleanCurrent === "/deathatlas" || cleanCurrent === "")
    )
      return true;
    return cleanCurrent === cleanHref;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <a
          href="/deathatlas/"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="size-9 rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Activity className="size-5 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-foreground font-mono">
                Death<span className="text-primary font-black">Atlas</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                2025
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground -mt-0.5 font-medium">
              by BanguDevClub
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right side controls: Theme + GitHub + Mobile menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSelector />

          <a
            href="https://github.com/BanguDevClub/deathatlas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 backdrop-blur text-card-foreground text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer shadow-sm"
            title="View Death Atlas repository on GitHub"
          >
            <GithubIcon className="size-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card px-4 pt-2 pb-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
