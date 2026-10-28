import React, { useState, useEffect, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { countries, getCountryById } from "@/lib/data";
import type { CountryData } from "@/lib/data";
import { CustomSelect, type SelectOption } from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  GitCompare,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  Users,
  ShieldCheck,
  Scale,
  Sparkles,
  Zap,
} from "lucide-react";

export const CompareView: React.FC = () => {
  const [c1Id, setC1Id] = useState<string>("JPN");
  const [c2Id, setC2Id] = useState<string>("USA");
  const [c3Id, setC3Id] = useState<string>("BRA");
  const [metricMode, setMetricMode] = useState<"percentage" | "per_100k">(
    "per_100k"
  );

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const p1 = params.get("c1");
      const p2 = params.get("c2");
      const p3 = params.get("c3");
      if (p1 && getCountryById(p1)) setC1Id(p1.toUpperCase());
      if (p2 && getCountryById(p2)) setC2Id(p2.toUpperCase());
      if (p3 && getCountryById(p3)) setC3Id(p3.toUpperCase());
    }
  }, []);

  const c1: CountryData = getCountryById(c1Id) || countries[0];
  const c2: CountryData = getCountryById(c2Id) || countries[1];
  const c3: CountryData | undefined = c3Id ? getCountryById(c3Id) : undefined;

  const compareList: CountryData[] = [c1, c2, ...(c3 ? [c3] : [])];
  const colors = ["#38bdf8", "#c084fc", "#f59e0b"];

  // Prepare select options with flags & badges
  const countryOptions: SelectOption[] = useMemo(() => {
    return countries.map((c) => ({
      value: c.id,
      label: c.name,
      flag: c.flag,
      badge: `Score: ${c.score}`,
      subtext: c.continent,
    }));
  }, []);

  const country3Options: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "None (Compare 2 Countries)" },
      ...countryOptions,
    ];
  }, [countryOptions]);

  // Bar Chart Data (3 groups): Supports both Percentage and Per-Capita
  const groupCompareData = [
    {
      group: "🧬 Natural",
      [c1.name]:
        metricMode === "percentage"
          ? c1.groups.natural.percentage
          : c1.groups.natural.rate_per_100k,
      [c2.name]:
        metricMode === "percentage"
          ? c2.groups.natural.percentage
          : c2.groups.natural.rate_per_100k,
      ...(c3
        ? {
            [c3.name]:
              metricMode === "percentage"
                ? c3.groups.natural.percentage
                : c3.groups.natural.rate_per_100k,
          }
        : {}),
    },
    {
      group: "⚠️ Accidental",
      [c1.name]:
        metricMode === "percentage"
          ? c1.groups.accidental.percentage
          : c1.groups.accidental.rate_per_100k,
      [c2.name]:
        metricMode === "percentage"
          ? c2.groups.accidental.percentage
          : c2.groups.accidental.rate_per_100k,
      ...(c3
        ? {
            [c3.name]:
              metricMode === "percentage"
                ? c3.groups.accidental.percentage
                : c3.groups.accidental.rate_per_100k,
          }
        : {}),
    },
    {
      group: "⚔️ Intentional",
      [c1.name]:
        metricMode === "percentage"
          ? c1.groups.intentional.percentage
          : c1.groups.intentional.rate_per_100k,
      [c2.name]:
        metricMode === "percentage"
          ? c2.groups.intentional.percentage
          : c2.groups.intentional.rate_per_100k,
      ...(c3
        ? {
            [c3.name]:
              metricMode === "percentage"
                ? c3.groups.intentional.percentage
                : c3.groups.intentional.rate_per_100k,
          }
        : {}),
    },
  ];

  // External Causes Comparison Data (Per 100k rates)
  const externalCausesData = [
    {
      cause: "Transport",
      [c1.name]: c1.rates_per_100k.transport,
      [c2.name]: c2.rates_per_100k.transport,
      ...(c3 ? { [c3.name]: c3.rates_per_100k.transport } : {}),
    },
    {
      cause: "Homicide",
      [c1.name]: c1.rates_per_100k.homicide,
      [c2.name]: c2.rates_per_100k.homicide,
      ...(c3 ? { [c3.name]: c3.rates_per_100k.homicide } : {}),
    },
    {
      cause: "Suicide",
      [c1.name]: c1.rates_per_100k.suicide,
      [c2.name]: c2.rates_per_100k.suicide,
      ...(c3 ? { [c3.name]: c3.rates_per_100k.suicide } : {}),
    },
    {
      cause: "War/Conflict",
      [c1.name]: c1.rates_per_100k.conflict_war,
      [c2.name]: c2.rates_per_100k.conflict_war,
      ...(c3 ? { [c3.name]: c3.rates_per_100k.conflict_war } : {}),
    },
    {
      cause: "Falls/Overdose",
      [c1.name]: c1.rates_per_100k.falls_drowning_poisoning,
      [c2.name]: c2.rates_per_100k.falls_drowning_poisoning,
      ...(c3 ? { [c3.name]: c3.rates_per_100k.falls_drowning_poisoning } : {}),
    },
  ];

  // Radar Chart Data
  const radarData = [
    {
      cause: "⏳ Senescence",
      [c1.name]: c1.groups.natural.breakdown.senescence.percentage,
      [c2.name]: c2.groups.natural.breakdown.senescence.percentage,
      ...(c3
        ? { [c3.name]: c3.groups.natural.breakdown.senescence.percentage }
        : {}),
    },
    {
      cause: "🎗️ Cancer",
      [c1.name]: c1.groups.natural.breakdown.neoplasms.percentage,
      [c2.name]: c2.groups.natural.breakdown.neoplasms.percentage,
      ...(c3
        ? { [c3.name]: c3.groups.natural.breakdown.neoplasms.percentage }
        : {}),
    },
    {
      cause: "🫀 Cardio",
      [c1.name]: c1.groups.natural.breakdown.cardiovascular.percentage,
      [c2.name]: c2.groups.natural.breakdown.cardiovascular.percentage,
      ...(c3
        ? { [c3.name]: c3.groups.natural.breakdown.cardiovascular.percentage }
        : {}),
    },
    {
      cause: "🦠 Infectious",
      [c1.name]: c1.groups.natural.breakdown.infectious_maternal.percentage,
      [c2.name]: c2.groups.natural.breakdown.infectious_maternal.percentage,
      ...(c3
        ? {
            [c3.name]:
              c3.groups.natural.breakdown.infectious_maternal.percentage,
          }
        : {}),
    },
    {
      cause: "🚗 Transport (×5)",
      [c1.name]: c1.groups.accidental.breakdown.transport.percentage * 5,
      [c2.name]: c2.groups.accidental.breakdown.transport.percentage * 5,
      ...(c3
        ? { [c3.name]: c3.groups.accidental.breakdown.transport.percentage * 5 }
        : {}),
    },
    {
      cause: "🔪 Homicide (×5)",
      [c1.name]: c1.groups.intentional.breakdown.homicide.percentage * 5,
      [c2.name]: c2.groups.intentional.breakdown.homicide.percentage * 5,
      ...(c3
        ? { [c3.name]: c3.groups.intentional.breakdown.homicide.percentage * 5 }
        : {}),
    },
    {
      cause: "🖤 Suicide (×5)",
      [c1.name]: c1.groups.intentional.breakdown.suicide.percentage * 5,
      [c2.name]: c2.groups.intentional.breakdown.suicide.percentage * 5,
      ...(c3
        ? { [c3.name]: c3.groups.intentional.breakdown.suicide.percentage * 5 }
        : {}),
    },
  ];

  // Analytical callouts
  const getRelativeRatio = (valA: number, valB: number) => {
    if (valB === 0) return valA > 0 ? "∞" : "1.0";
    return (valA / valB).toFixed(1);
  };

  const hasEstimatedData = compareList.some(
    (c) => c.data_confidence !== "high"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider font-mono">
          <GitCompare className="size-3.5" />
          <span>Cross-National Comparative Analytics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
          Detailed Country Comparison
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Juxtapose sovereign nations side-by-side using flag visualizers,
          category emojis, full cause taxonomies, and normalized{" "}
          <strong>per capita rates per 100,000 residents</strong>.
        </p>
      </div>

      {/* Selectors Bar (Using CustomSelect Component) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur shadow-md">
        {/* Country 1 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <span>Primary Country</span>
            <Badge
              variant="outline"
              className="border-sky-500/30 text-sky-400 text-[10px] py-0"
            >
              1
            </Badge>
          </label>
          <CustomSelect
            options={countryOptions}
            value={c1Id}
            onChange={(val) => setC1Id(val)}
            placeholder="Select Country 1..."
            size="lg"
          />
        </div>

        {/* Country 2 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-purple-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <span>Comparison Country</span>
            <Badge
              variant="outline"
              className="border-purple-500/30 text-purple-400 text-[10px] py-0"
            >
              2
            </Badge>
          </label>
          <CustomSelect
            options={countryOptions}
            value={c2Id}
            onChange={(val) => setC2Id(val)}
            placeholder="Select Country 2..."
            size="lg"
          />
        </div>

        {/* Country 3 (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <span>Third Nation (Optional)</span>
            <Badge
              variant="outline"
              className="border-amber-500/30 text-amber-400 text-[10px] py-0"
            >
              3
            </Badge>
          </label>
          <CustomSelect
            options={country3Options}
            value={c3Id}
            onChange={(val) => setC3Id(val)}
            placeholder="Add 3rd Country..."
            size="lg"
          />
        </div>
      </div>

      {/* Metric Mode Switcher Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <Scale className="size-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
            Analytical Metric Mode:
          </span>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-card border border-border">
          <button
            type="button"
            onClick={() => setMetricMode("per_100k")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              metricMode === "per_100k"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5" />
            <span>Per Capita (per 100k population)</span>
          </button>
          <button
            type="button"
            onClick={() => setMetricMode("percentage")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              metricMode === "percentage"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Percent className="size-3.5" />
            <span>Proportional Share (% of Deaths)</span>
          </button>
        </div>
      </div>

      {/* Analytical Insights & Relative Ratios Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/60 bg-card/60 p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-muted-foreground">
              🔪 Homicide Ratio
            </span>
            <Sparkles className="size-3.5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-foreground">
              {getRelativeRatio(
                c1.rates_per_100k.homicide,
                c2.rates_per_100k.homicide
              )}
              ×
            </span>
            <span className="text-xs text-muted-foreground">
              {c1.rates_per_100k.homicide >= c2.rates_per_100k.homicide
                ? `${c1.name} vs ${c2.name}`
                : `${c2.name} vs ${c1.name}`}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {c1.flag} {c1.rates_per_100k.homicide} vs {c2.flag}{" "}
            {c2.rates_per_100k.homicide} per 100k
          </p>
        </Card>

        <Card className="border-border/60 bg-card/60 p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-muted-foreground">
              ⏳ Senescence Ratio
            </span>
            <TrendingUp className="size-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-foreground">
              {getRelativeRatio(
                c1.rates_per_100k.senescence,
                c2.rates_per_100k.senescence
              )}
              ×
            </span>
            <span className="text-xs text-muted-foreground">
              {c1.rates_per_100k.senescence >= c2.rates_per_100k.senescence
                ? `${c1.name} vs ${c2.name}`
                : `${c2.name} vs ${c1.name}`}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {c1.flag} {c1.rates_per_100k.senescence} vs {c2.flag}{" "}
            {c2.rates_per_100k.senescence} per 100k
          </p>
        </Card>

        <Card className="border-border/60 bg-card/60 p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-muted-foreground">
              🚗 Transport Ratio
            </span>
            <Zap className="size-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-foreground">
              {getRelativeRatio(
                c1.rates_per_100k.transport,
                c2.rates_per_100k.transport
              )}
              ×
            </span>
            <span className="text-xs text-muted-foreground">
              {c1.rates_per_100k.transport >= c2.rates_per_100k.transport
                ? `${c1.name} vs ${c2.name}`
                : `${c2.name} vs ${c1.name}`}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {c1.flag} {c1.rates_per_100k.transport} vs {c2.flag}{" "}
            {c2.rates_per_100k.transport} per 100k
          </p>
        </Card>
      </div>

      {/* Uncertainty Notice */}
      {hasEstimatedData && (
        <Alert
          variant="warning"
          className="border-amber-500/30 bg-amber-500/10"
        >
          <AlertTriangle className="size-4" />
          <AlertTitle className="text-xs font-bold">
            Note on Synthetic Demographic Projections
          </AlertTitle>
          <AlertDescription className="text-xs mt-1">
            One or more of the selected jurisdictions has active conflict
            conditions or incomplete vital registration. Projections are modeled
            via UN WPP and WHO baseline rates.
          </AlertDescription>
        </Alert>
      )}

      {/* Side-by-Side Country Dossier Cards */}
      <div
        className={`grid grid-cols-1 ${c3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4`}
      >
        {compareList.map((c, idx) => (
          <Card
            key={c.id}
            className="border-border/60 bg-card/60 backdrop-blur"
          >
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <span
                  className="text-3xl leading-none"
                  role="img"
                  aria-label={`${c.name} Flag`}
                >
                  {c.flag}
                </span>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  Rank #{c.rank}
                </span>
              </div>
              <CardTitle className="text-xl font-bold font-mono mt-2 text-foreground flex items-center gap-2">
                <span>{c.name}</span>
                <span className="text-xs font-normal text-muted-foreground font-mono">
                  ({c.id})
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                {c.continent} • Population:{" "}
                {(c.population / 1_000_000).toFixed(2)}M
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-2.5 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground font-mono">
                  Death Atlas Score:
                </span>
                <span
                  className="text-2xl font-black font-mono"
                  style={{ color: colors[idx] }}
                >
                  {c.score}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    / 100
                  </span>
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                <span className="text-muted-foreground">Life Expectancy:</span>
                <span className="font-bold font-mono text-foreground">
                  {c.life_expectancy} yrs
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                <span className="text-muted-foreground">Crude Death Rate:</span>
                <span className="font-bold font-mono text-foreground">
                  {c.crude_death_rate} per 1k
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                <span className="text-muted-foreground">
                  All-Cause Rate per 100k:
                </span>
                <span className="font-bold font-mono text-foreground">
                  {c.rates_per_100k.total}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                <span className="text-muted-foreground">
                  Homicide Rate per 100k:
                </span>
                <span className="font-bold font-mono text-rose-400">
                  {c.rates_per_100k.homicide}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                <span className="text-muted-foreground">Data Confidence:</span>
                <span
                  className={`capitalize font-semibold inline-flex items-center gap-1 ${
                    c.data_confidence === "high"
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }`}
                >
                  {c.data_confidence === "high" ? (
                    <ShieldCheck className="size-3" />
                  ) : (
                    <AlertTriangle className="size-3" />
                  )}
                  {c.data_confidence}
                </span>
              </div>
              <div className="pt-2">
                <a href={`/deathatlas/dashboard?country=${c.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold gap-1 text-primary"
                  >
                    View Complete Dossier <ArrowRight className="size-3" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Graphs: Group Comparison + Radar + External Causes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3 Groups Comparison Bar Chart */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono">
              The Three Mortality Groups (
              {metricMode === "per_100k"
                ? "Per 100k Residents"
                : "% of All Deaths"}
              )
            </CardTitle>
            <CardDescription className="text-xs">
              Natural vs Accidental vs Intentional rates.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={groupCompareData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                <YAxis
                  unit={metricMode === "percentage" ? "%" : ""}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    metricMode === "percentage" ? `${val}%` : `${val} per 100k`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey={c1.name} fill={colors[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey={c2.name} fill={colors[1]} radius={[4, 4, 0, 0]} />
                {c3 && (
                  <Bar
                    dataKey={c3.name}
                    fill={colors[2]}
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* External Trauma & Intentional Causes Bar Chart */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono">
              External & Trauma Causes (Rate per 100,000 residents)
            </CardTitle>
            <CardDescription className="text-xs">
              Direct public safety comparison normalized for population size.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={externalCausesData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis dataKey="cause" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} per 100k`, name]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey={c1.name} fill={colors[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey={c2.name} fill={colors[1]} radius={[4, 4, 0, 0]} />
                {c3 && (
                  <Bar
                    dataKey={c3.name}
                    fill={colors[2]}
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart */}
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base font-bold font-mono">
            Multi-Dimensional Cause Radar
          </CardTitle>
          <CardDescription className="text-xs">
            Proportional signature across biological and external trauma
            vectors.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="cause"
                tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 45]}
                tick={{ fontSize: 9 }}
              />
              <Radar
                name={c1.name}
                dataKey={c1.name}
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.25}
              />
              <Radar
                name={c2.name}
                dataKey={c2.name}
                stroke={colors[1]}
                fill={colors[1]}
                fillOpacity={0.25}
              />
              {c3 && (
                <Radar
                  name={c3.name}
                  dataKey={c3.name}
                  stroke={colors[2]}
                  fill={colors[2]}
                  fillOpacity={0.25}
                />
              )}
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comprehensive Full Breakdown Table (Both % and Per-Capita) */}
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base font-bold font-mono">
            Complete Cause-of-Death Taxonomy & Per-Capita Matrix
          </CardTitle>
          <CardDescription className="text-xs">
            Examine absolute deaths, proportional shares, and per-capita rates
            per 100,000 residents side-by-side.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Cause Classification</th>
                  <th className="p-3" style={{ color: colors[0] }}>
                    {c1.flag} {c1.name}
                  </th>
                  <th className="p-3" style={{ color: colors[1] }}>
                    {c2.flag} {c2.name}
                  </th>
                  {c3 && (
                    <th className="p-3" style={{ color: colors[2] }}>
                      {c3.flag} {c3.name}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {/* Natural Header */}
                <tr className="bg-sky-500/5 font-sans font-bold text-sky-400">
                  <td colSpan={c3 ? 4 : 3} className="p-2.5 text-xs">
                    🧬 NATURAL CAUSES
                  </td>
                </tr>

                <TableRowItem
                  label="⏳ Old Age & Senescence"
                  item1={c1.groups.natural.breakdown.senescence}
                  rate1={c1.rates_per_100k.senescence}
                  item2={c2.groups.natural.breakdown.senescence}
                  rate2={c2.rates_per_100k.senescence}
                  item3={c3?.groups.natural.breakdown.senescence}
                  rate3={c3?.rates_per_100k.senescence}
                  mode={metricMode}
                />

                <TableRowItem
                  label="🎗️ Neoplasms (Cancers)"
                  item1={c1.groups.natural.breakdown.neoplasms}
                  rate1={c1.rates_per_100k.neoplasms}
                  item2={c2.groups.natural.breakdown.neoplasms}
                  rate2={c2.rates_per_100k.neoplasms}
                  item3={c3?.groups.natural.breakdown.neoplasms}
                  rate3={c3?.rates_per_100k.neoplasms}
                  mode={metricMode}
                />

                <TableRowItem
                  label="🫀 Cardiovascular Diseases"
                  item1={c1.groups.natural.breakdown.cardiovascular}
                  rate1={c1.rates_per_100k.cardiovascular}
                  item2={c2.groups.natural.breakdown.cardiovascular}
                  rate2={c2.rates_per_100k.cardiovascular}
                  item3={c3?.groups.natural.breakdown.cardiovascular}
                  rate3={c3?.rates_per_100k.cardiovascular}
                  mode={metricMode}
                />

                <TableRowItem
                  label="🫁 Chronic Respiratory"
                  item1={c1.groups.natural.breakdown.respiratory}
                  rate1={c1.rates_per_100k.respiratory}
                  item2={c2.groups.natural.breakdown.respiratory}
                  rate2={c2.rates_per_100k.respiratory}
                  item3={c3?.groups.natural.breakdown.respiratory}
                  rate3={c3?.rates_per_100k.respiratory}
                  mode={metricMode}
                />

                <TableRowItem
                  label="🧠 Neurodegenerative (Alzheimer's)"
                  item1={c1.groups.natural.breakdown.neurodegenerative}
                  rate1={c1.rates_per_100k.neurodegenerative}
                  item2={c2.groups.natural.breakdown.neurodegenerative}
                  rate2={c2.rates_per_100k.neurodegenerative}
                  item3={c3?.groups.natural.breakdown.neurodegenerative}
                  rate3={c3?.rates_per_100k.neurodegenerative}
                  mode={metricMode}
                />

                <TableRowItem
                  label="🦠 Infectious & Maternal"
                  item1={c1.groups.natural.breakdown.infectious_maternal}
                  rate1={c1.rates_per_100k.infectious_maternal}
                  item2={c2.groups.natural.breakdown.infectious_maternal}
                  rate2={c2.rates_per_100k.infectious_maternal}
                  item3={c3?.groups.natural.breakdown.infectious_maternal}
                  rate3={c3?.rates_per_100k.infectious_maternal}
                  mode={metricMode}
                />

                {/* Accidental Header */}
                <tr className="bg-amber-500/5 font-sans font-bold text-amber-400">
                  <td colSpan={c3 ? 4 : 3} className="p-2.5 text-xs">
                    ⚠️ EXTERNAL ACCIDENTAL TRAUMA
                  </td>
                </tr>

                <TableRowItem
                  label="🚗 Road & Transport Crashes"
                  item1={c1.groups.accidental.breakdown.transport}
                  rate1={c1.rates_per_100k.transport}
                  item2={c2.groups.accidental.breakdown.transport}
                  rate2={c2.rates_per_100k.transport}
                  item3={c3?.groups.accidental.breakdown.transport}
                  rate3={c3?.rates_per_100k.transport}
                  mode={metricMode}
                  colorClass="text-amber-400"
                />

                <TableRowItem
                  label="🚧 Occupational Accidents"
                  item1={c1.groups.accidental.breakdown.occupational}
                  rate1={c1.rates_per_100k.occupational}
                  item2={c2.groups.accidental.breakdown.occupational}
                  rate2={c2.rates_per_100k.occupational}
                  item3={c3?.groups.accidental.breakdown.occupational}
                  rate3={c3?.rates_per_100k.occupational}
                  mode={metricMode}
                  colorClass="text-amber-400"
                />

                <TableRowItem
                  label="🌪️ Natural Disasters"
                  item1={c1.groups.accidental.breakdown.natural_disasters}
                  rate1={c1.rates_per_100k.natural_disasters}
                  item2={c2.groups.accidental.breakdown.natural_disasters}
                  rate2={c2.rates_per_100k.natural_disasters}
                  item3={c3?.groups.accidental.breakdown.natural_disasters}
                  rate3={c3?.rates_per_100k.natural_disasters}
                  mode={metricMode}
                  colorClass="text-amber-400"
                />

                <TableRowItem
                  label="🩹 Falls, Drowning & Overdoses"
                  item1={
                    c1.groups.accidental.breakdown.falls_drowning_poisoning
                  }
                  rate1={c1.rates_per_100k.falls_drowning_poisoning}
                  item2={
                    c2.groups.accidental.breakdown.falls_drowning_poisoning
                  }
                  rate2={c2.rates_per_100k.falls_drowning_poisoning}
                  item3={
                    c3?.groups.accidental.breakdown.falls_drowning_poisoning
                  }
                  rate3={c3?.rates_per_100k.falls_drowning_poisoning}
                  mode={metricMode}
                  colorClass="text-amber-400"
                />

                {/* Intentional Header */}
                <tr className="bg-rose-500/5 font-sans font-bold text-rose-400">
                  <td colSpan={c3 ? 4 : 3} className="p-2.5 text-xs">
                    ⚔️ EXTERNAL INTENTIONAL TRAUMA
                  </td>
                </tr>

                <TableRowItem
                  label="🔪 Interpersonal Homicide"
                  item1={c1.groups.intentional.breakdown.homicide}
                  rate1={c1.rates_per_100k.homicide}
                  item2={c2.groups.intentional.breakdown.homicide}
                  rate2={c2.rates_per_100k.homicide}
                  item3={c3?.groups.intentional.breakdown.homicide}
                  rate3={c3?.rates_per_100k.homicide}
                  mode={metricMode}
                  colorClass="text-rose-400"
                />

                <TableRowItem
                  label="🖤 Suicide & Self-Harm"
                  item1={c1.groups.intentional.breakdown.suicide}
                  rate1={c1.rates_per_100k.suicide}
                  item2={c2.groups.intentional.breakdown.suicide}
                  rate2={c2.rates_per_100k.suicide}
                  item3={c3?.groups.intentional.breakdown.suicide}
                  rate3={c3?.rates_per_100k.suicide}
                  mode={metricMode}
                  colorClass="text-rose-400"
                />

                <TableRowItem
                  label="💣 Armed Conflict & War"
                  item1={c1.groups.intentional.breakdown.conflict_war}
                  rate1={c1.rates_per_100k.conflict_war}
                  item2={c2.groups.intentional.breakdown.conflict_war}
                  rate2={c2.rates_per_100k.conflict_war}
                  item3={c3?.groups.intentional.breakdown.conflict_war}
                  rate3={c3?.rates_per_100k.conflict_war}
                  mode={metricMode}
                  colorClass="text-rose-400"
                />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface TableRowItemProps {
  label: string;
  item1: any;
  rate1: number;
  item2: any;
  rate2: number;
  item3?: any;
  rate3?: number;
  mode: "percentage" | "per_100k";
  colorClass?: string;
}

const TableRowItem: React.FC<TableRowItemProps> = ({
  label,
  item1,
  rate1,
  item2,
  rate2,
  item3,
  rate3,
  mode,
  colorClass = "text-foreground",
}) => {
  return (
    <tr className="hover:bg-muted/40 transition-colors">
      <td className="p-3 font-semibold text-foreground font-sans">{label}</td>
      <td className={`p-3 ${colorClass}`}>
        {mode === "per_100k" ? (
          <div>
            <strong>{rate1}</strong>{" "}
            <span className="text-[10px] text-muted-foreground">/ 100k</span>
            <span className="block text-[10px] text-muted-foreground">
              ({item1.percentage}% • {item1.total.toLocaleString()} deaths)
            </span>
          </div>
        ) : (
          <div>
            <strong>{item1.percentage}%</strong>
            <span className="block text-[10px] text-muted-foreground">
              ({rate1} / 100k • {item1.total.toLocaleString()} deaths)
            </span>
          </div>
        )}
      </td>
      <td className={`p-3 ${colorClass}`}>
        {mode === "per_100k" ? (
          <div>
            <strong>{rate2}</strong>{" "}
            <span className="text-[10px] text-muted-foreground">/ 100k</span>
            <span className="block text-[10px] text-muted-foreground">
              ({item2.percentage}% • {item2.total.toLocaleString()} deaths)
            </span>
          </div>
        ) : (
          <div>
            <strong>{item2.percentage}%</strong>
            <span className="block text-[10px] text-muted-foreground">
              ({rate2} / 100k • {item2.total.toLocaleString()} deaths)
            </span>
          </div>
        )}
      </td>
      {item3 && rate3 !== undefined && (
        <td className={`p-3 ${colorClass}`}>
          {mode === "per_100k" ? (
            <div>
              <strong>{rate3}</strong>{" "}
              <span className="text-[10px] text-muted-foreground">/ 100k</span>
              <span className="block text-[10px] text-muted-foreground">
                ({item3.percentage}% • {item3.total.toLocaleString()} deaths)
              </span>
            </div>
          ) : (
            <div>
              <strong>{item3.percentage}%</strong>
              <span className="block text-[10px] text-muted-foreground">
                ({rate3} / 100k • {item3.total.toLocaleString()} deaths)
              </span>
            </div>
          )}
        </td>
      )}
    </tr>
  );
};
