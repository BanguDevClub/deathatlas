import React, { useState } from "react";
import {
  HeartHandshake,
  ShieldAlert,
  Skull,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BarChart2,
  TrendingUp,
  Search,
} from "lucide-react";
import { metadata, countries } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const OverviewHero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries =
    searchQuery.trim() === ""
      ? []
      : countries
          .filter((c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5);

  const topCountries = countries.slice(0, 5);
  const bottomCountries = countries.slice(-5).reverse();

  // Chart data for global summary
  const groupPieData = [
    {
      name: "Natural Deaths",
      value: metadata.groups_summary.natural.percentage,
      count: metadata.groups_summary.natural.total,
      color: "#38bdf8",
    },
    {
      name: "Accidental Deaths",
      value: metadata.groups_summary.accidental.percentage,
      count: metadata.groups_summary.accidental.total,
      color: "#f59e0b",
    },
    {
      name: "Intentional Deaths",
      value: metadata.groups_summary.intentional.percentage,
      count: metadata.groups_summary.intentional.total,
      color: "#ef4444",
    },
  ];

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 border-b border-border/40">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 size-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold shadow-sm">
            <Sparkles className="size-3.5" />
            <span>2025 Global Mortality Observatory • 195 Nations</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl font-mono">
            How Humanity{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
              Dies
            </span>{" "}
            in 2025.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Death Atlas is an open-source analytics platform by{" "}
            <strong className="text-foreground">BanguDevClub</strong> mapping
            global mortality metrics, cause-of-death breakdowns, and longevity
            dynamics across all 195 UN-recognized countries.
          </p>

          {/* Quick Search */}
          <div className="relative w-full max-w-md mt-2">
            <Input
              type="text"
              placeholder="Search any of the 195 nations (e.g. Japan, Brazil, Ukraine)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              prefixIcon={<Search className="size-4" />}
              inputSize="lg"
            />
            {filteredCountries.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl p-2 z-30 flex flex-col gap-1 text-left">
                {filteredCountries.map((c) => (
                  <a
                    key={c.id}
                    href={`/deathatlas/dashboard?country=${c.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="text-lg leading-none"
                        role="img"
                        aria-label={`${c.name} Flag`}
                      >
                        {c.flag}
                      </span>
                      <span className="font-semibold text-foreground">
                        {c.name}
                      </span>
                      <span className="text-muted-foreground">
                        ({c.continent})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        Score: {c.score}
                      </Badge>
                      <ArrowRight className="size-3 text-muted-foreground" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="/deathatlas/dashboard">
              <Button size="lg" className="gap-2 font-semibold shadow-md">
                <BarChart2 className="size-4" />
                Explore Dashboard
              </Button>
            </a>
            <a href="/deathatlas/ranking">
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 font-semibold"
              >
                View 195 Rankings
              </Button>
            </a>
            <a href="/deathatlas/sandbox">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 font-semibold"
              >
                Try Sandbox Simulator
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Global Key Metrics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-mono tracking-wider">
                Total Deaths (2025)
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {(metadata.global_deaths / 1_000_000).toFixed(1)}M
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Out of {(metadata.global_population / 1_000_000_000).toFixed(2)}
                B people globally (~{metadata.global_crude_death_rate} per 1k)
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-mono tracking-wider">
                Global Atlas Score
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-primary">
                {metadata.global_score}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / 100
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Baseline world score weighted by cause avoidability
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-mono tracking-wider">
                Natural Deaths
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-sky-400">
                {metadata.groups_summary.natural.percentage}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {(metadata.groups_summary.natural.total / 1_000_000).toFixed(1)}
                M deaths from senescence & disease
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-mono tracking-wider">
                Trauma & Violence
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-rose-400">
                {(
                  metadata.groups_summary.accidental.percentage +
                  metadata.groups_summary.intentional.percentage
                ).toFixed(2)}
                %
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {metadata.groups_summary.accidental.percentage}% accidental +{" "}
                {metadata.groups_summary.intentional.percentage}% intentional
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The 3 Core Groups Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider font-mono">
            <TrendingUp className="size-3.5" />
            <span>Taxonomy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            The Three Pillars of Human Mortality
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Every death in the 195 countries is classified into three mutually
            exclusive categories, further split into detailed subcategories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Group 1: Natural */}
          <Card className="border-sky-500/30 bg-card/60 hover:border-sky-500/60 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <HeartHandshake className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="border-sky-500/30 text-sky-400"
                >
                  {metadata.groups_summary.natural.percentage}% of Deaths
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold mt-4">
                Natural Deaths
              </CardTitle>
              <CardDescription>
                Internal biological processes, chronic degeneration, and
                infectious pathogens.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Old Age & Senescence</span>
                <span className="font-semibold text-foreground">
                  Highest quality (1.00 weight)
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Neoplasms (Cancers)</span>
                <span className="font-semibold text-foreground">
                  ~20-28% developed
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Cardiovascular & Circulatory</span>
                <span className="font-semibold text-foreground">
                  Leading global killer
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Neurodegenerative (Alzheimer's)</span>
                <span className="font-semibold text-foreground">
                  Longevity indicator
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Infectious & Communicable</span>
                <span className="font-semibold text-foreground">
                  High in developing
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Group 2: Accidental */}
          <Card className="border-amber-500/30 bg-card/60 hover:border-amber-500/60 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <ShieldAlert className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="border-amber-500/30 text-amber-400"
                >
                  {metadata.groups_summary.accidental.percentage}% of Deaths
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold mt-4">
                External Accidental
              </CardTitle>
              <CardDescription>
                Unintentional physical trauma, industrial hazards, and climate
                disasters.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Road & Transport Accidents</span>
                <span className="font-semibold text-foreground">
                  ~1.2M yearly globally
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Occupational & Work Hazards</span>
                <span className="font-semibold text-foreground">
                  Construction, mining
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Natural Disasters & Floods</span>
                <span className="font-semibold text-foreground">
                  Extreme weather events
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Unintentional Poisoning & Falls</span>
                <span className="font-semibold text-foreground">
                  Overdoses & slip-falls
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Group 3: Intentional */}
          <Card className="border-rose-500/30 bg-card/60 hover:border-rose-500/60 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Skull className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="border-rose-500/30 text-rose-400"
                >
                  {metadata.groups_summary.intentional.percentage}% of Deaths
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold mt-4">
                External Intentional
              </CardTitle>
              <CardDescription>
                Violent deaths inflicted deliberately by self, individuals, or
                armed groups.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Suicide & Self-Harm</span>
                <span className="font-semibold text-foreground">
                  ~700k+ annually
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Interpersonal Homicide</span>
                <span className="font-semibold text-foreground">
                  Violent crime & gun homicide
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span>Armed Conflict & Wars</span>
                <span className="font-semibold text-foreground">
                  Ukraine, Sudan, Palestine
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Terrorism & Mass Attacks</span>
                <span className="font-semibold text-foreground">
                  Collective violence
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Global Distribution Visualization */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mono">
              2025 Global Mortality Breakdown (62.6 Million Deaths)
            </CardTitle>
            <CardDescription>
              Interactive proportion of deaths worldwide across the three
              primary classifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2 h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={groupPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {groupPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              {groupPieData.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col gap-1.5 p-3 rounded-lg border border-border/50 bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-semibold text-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold font-mono">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    ~{(item.count / 1_000_000).toFixed(2)} million deaths
                    globally
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Top vs Bottom Rank Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 High Longevity Nations */}
          <Card className="border-border/60 bg-card/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                  <CardTitle className="text-lg font-bold">
                    Highest Quality Longevity
                  </CardTitle>
                </div>
                <Badge variant="success">Top Ranked</Badge>
              </div>
              <CardDescription>
                Nations where senescence and late-adulthood natural causes
                dominate over premature trauma.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {topCountries.map((c) => (
                <a
                  key={c.id}
                  href={`/deathatlas/dashboard?country=${c.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-muted-foreground w-6">
                      #{c.rank}
                    </span>
                    <span
                      className="text-xl leading-none"
                      role="img"
                      aria-label={`${c.name} Flag`}
                    >
                      {c.flag}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Life Exp: {c.life_expectancy} yrs •{" "}
                        {c.rates_per_100k.total}/100k
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-primary font-mono">
                      {c.score}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Score
                    </span>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>

          {/* Bottom 5 Crisis Nations */}
          <Card className="border-border/60 bg-card/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-amber-500" />
                  <CardTitle className="text-lg font-bold">
                    Most Crisis Impacted
                  </CardTitle>
                </div>
                <Badge variant="warning">High Vulnerability</Badge>
              </div>
              <CardDescription>
                Nations facing active war, armed conflict, institutional
                breakdown, or acute epidemics.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {bottomCountries.map((c) => (
                <a
                  key={c.id}
                  href={`/deathatlas/dashboard?country=${c.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-muted-foreground w-6">
                      #{c.rank}
                    </span>
                    <span
                      className="text-xl leading-none"
                      role="img"
                      aria-label={`${c.name} Flag`}
                    >
                      {c.flag}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-amber-400">
                        {c.groups.intentional.percentage > 10
                          ? `⚔️ Intentional: ${c.groups.intentional.percentage}%`
                          : "High disease burden"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-400 font-mono">
                      {c.score}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Score
                    </span>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Methodology Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground font-mono">
              The Death Atlas Mathematical Methodology
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              How does a country score 100 vs 0? Our scoring algorithm weights
              mortality causes based on natural biological limits, premature
              years of life lost, and preventability. All equations are rendered
              in KaTeX with complete open documentation.
            </p>
          </div>
          <a href="/deathatlas/methodology">
            <Button
              size="lg"
              className="whitespace-nowrap font-semibold gap-2 shadow-md"
            >
              Read Methodology
              <ArrowRight className="size-4" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};
