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
  Plus,
  X,
  RotateCcw,
  Layers,
  Sigma,
} from "lucide-react";

const COLOR_PALETTE = [
  "#38bdf8", // Sky
  "#c084fc", // Purple
  "#f59e0b", // Amber
  "#34d399", // Emerald
  "#f43f5e", // Rose
  "#06b6d4", // Cyan
  "#a855f7", // Violet
  "#fb923c", // Orange
  "#e879f9", // Fuchsia
  "#a3e635", // Lime
];

const PRESET_GROUPS = [
  { name: "Default (3)", ids: ["JPN", "USA", "BRA"] },
  { name: "BRICS (5)", ids: ["BRA", "RUS", "IND", "CHN", "ZAF"] },
  { name: "G7 Cohort (4)", ids: ["USA", "JPN", "DEU", "GBR"] },
  { name: "Nordic Longevity (3)", ids: ["SWE", "NOR", "DNK"] },
  { name: "Latin America (4)", ids: ["BRA", "MEX", "COL", "ARG"] },
];

export const CompareView: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "JPN",
    "USA",
    "BRA",
  ]);
  const [metricMode, setMetricMode] = useState<"percentage" | "per_100k">(
    "per_100k"
  );
  const [addSelectKey, setAddSelectKey] = useState<number>(0);

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const countriesParam = params.get("countries");
      if (countriesParam) {
        const ids = countriesParam
          .split(",")
          .map((s) => s.trim().toUpperCase())
          .filter((id) => getCountryById(id));
        if (ids.length > 0) {
          setSelectedIds(Array.from(new Set(ids)));
          return;
        }
      }
      const p1 = params.get("c1");
      const p2 = params.get("c2");
      const p3 = params.get("c3");
      const legacy: string[] = [];
      if (p1 && getCountryById(p1)) legacy.push(p1.toUpperCase());
      if (p2 && getCountryById(p2)) legacy.push(p2.toUpperCase());
      if (p3 && getCountryById(p3)) legacy.push(p3.toUpperCase());
      if (legacy.length > 0) {
        if (legacy.length === 1) {
          legacy.push(legacy[0] === "USA" ? "JPN" : "USA");
        }
        setSelectedIds(Array.from(new Set(legacy)));
      }
    }
  }, []);

  // Sync selected countries to URL
  useEffect(() => {
    if (typeof window !== "undefined" && selectedIds.length > 0) {
      const url = new URL(window.location.href);
      url.searchParams.set("countries", selectedIds.join(","));
      url.searchParams.delete("c1");
      url.searchParams.delete("c2");
      url.searchParams.delete("c3");
      window.history.replaceState({}, "", url.toString());
    }
  }, [selectedIds]);

  const selectedCountries: CountryData[] = useMemo(() => {
    return selectedIds
      .map((id) => getCountryById(id))
      .filter((c): c is CountryData => Boolean(c));
  }, [selectedIds]);

  const addCountry = (newId: string) => {
    if (!newId || selectedIds.includes(newId)) return;
    setSelectedIds((prev) => [...prev, newId]);
    setAddSelectKey((k) => k + 1);
  };

  const removeCountry = (idToRemove: string) => {
    if (selectedIds.length <= 1) return;
    setSelectedIds((prev) => prev.filter((id) => id !== idToRemove));
  };

  // Options available for adding (excluding already selected)
  const availableOptions: SelectOption[] = useMemo(() => {
    return countries
      .filter((c) => !selectedIds.includes(c.id))
      .map((c) => ({
        value: c.id,
        label: c.name,
        flag: c.flag,
        badge: `Score: ${c.score}`,
        subtext: `${c.continent} • Pop: ${(c.population / 1_000_000).toFixed(1)}M`,
      }));
  }, [selectedIds]);

  // Aggregate Cohort Totals for the 3 groups
  const cohortTotals = useMemo(() => {
    const totalPopulation = selectedCountries.reduce(
      (sum, c) => sum + c.population,
      0
    );
    const totalDeaths = selectedCountries.reduce(
      (sum, c) => sum + c.total_deaths,
      0
    );

    const naturalDeaths = selectedCountries.reduce(
      (sum, c) => sum + c.groups.natural.total,
      0
    );
    const accidentalDeaths = selectedCountries.reduce(
      (sum, c) => sum + c.groups.accidental.total,
      0
    );
    const intentionalDeaths = selectedCountries.reduce(
      (sum, c) => sum + c.groups.intentional.total,
      0
    );

    const naturalPct =
      totalDeaths > 0 ? (naturalDeaths / totalDeaths) * 100 : 0;
    const accidentalPct =
      totalDeaths > 0 ? (accidentalDeaths / totalDeaths) * 100 : 0;
    const intentionalPct =
      totalDeaths > 0 ? (intentionalDeaths / totalDeaths) * 100 : 0;

    const naturalRate100k =
      totalPopulation > 0 ? (naturalDeaths / totalPopulation) * 100_000 : 0;
    const accidentalRate100k =
      totalPopulation > 0 ? (accidentalDeaths / totalPopulation) * 100_000 : 0;
    const intentionalRate100k =
      totalPopulation > 0 ? (intentionalDeaths / totalPopulation) * 100_000 : 0;
    const allRate100k =
      totalPopulation > 0 ? (totalDeaths / totalPopulation) * 100_000 : 0;

    return {
      totalPopulation,
      totalDeaths,
      natural: {
        deaths: naturalDeaths,
        pct: naturalPct.toFixed(1),
        rate100k: naturalRate100k.toFixed(1),
      },
      accidental: {
        deaths: accidentalDeaths,
        pct: accidentalPct.toFixed(1),
        rate100k: accidentalRate100k.toFixed(1),
      },
      intentional: {
        deaths: intentionalDeaths,
        pct: intentionalPct.toFixed(1),
        rate100k: intentionalRate100k.toFixed(1),
      },
      allRate100k: allRate100k.toFixed(1),
    };
  }, [selectedCountries]);

  // Bar Chart Data (3 groups): Supports both Percentage and Per-Capita
  const groupCompareData = useMemo(() => {
    return [
      {
        group: "🧬 Natural",
        ...Object.fromEntries(
          selectedCountries.map((c) => [
            c.name,
            metricMode === "percentage"
              ? c.groups.natural.percentage
              : c.groups.natural.rate_per_100k,
          ])
        ),
      },
      {
        group: "⚠️ Accidental",
        ...Object.fromEntries(
          selectedCountries.map((c) => [
            c.name,
            metricMode === "percentage"
              ? c.groups.accidental.percentage
              : c.groups.accidental.rate_per_100k,
          ])
        ),
      },
      {
        group: "⚔️ Intentional",
        ...Object.fromEntries(
          selectedCountries.map((c) => [
            c.name,
            metricMode === "percentage"
              ? c.groups.intentional.percentage
              : c.groups.intentional.rate_per_100k,
          ])
        ),
      },
    ];
  }, [selectedCountries, metricMode]);

  // External Causes Comparison Data (Per 100k rates)
  const externalCausesData = useMemo(() => {
    const causes = [
      { label: "Transport", key: "transport" as const },
      { label: "Homicide", key: "homicide" as const },
      { label: "Suicide", key: "suicide" as const },
      { label: "War/Conflict", key: "conflict_war" as const },
      { label: "Falls/Overdose", key: "falls_drowning_poisoning" as const },
    ];
    return causes.map(({ label, key }) => ({
      cause: label,
      ...Object.fromEntries(
        selectedCountries.map((c) => [c.name, c.rates_per_100k[key]])
      ),
    }));
  }, [selectedCountries]);

  // Radar Chart Data
  const radarData = useMemo(() => {
    const radarCategories = [
      {
        cause: "⏳ Senescence",
        getVal: (c: CountryData) =>
          c.groups.natural.breakdown.senescence.percentage,
      },
      {
        cause: "🎗️ Cancer",
        getVal: (c: CountryData) =>
          c.groups.natural.breakdown.neoplasms.percentage,
      },
      {
        cause: "🫀 Cardio",
        getVal: (c: CountryData) =>
          c.groups.natural.breakdown.cardiovascular.percentage,
      },
      {
        cause: "🦠 Infectious",
        getVal: (c: CountryData) =>
          c.groups.natural.breakdown.infectious_maternal.percentage,
      },
      {
        cause: "🚗 Transport (×5)",
        getVal: (c: CountryData) =>
          c.groups.accidental.breakdown.transport.percentage * 5,
      },
      {
        cause: "🔪 Homicide (×5)",
        getVal: (c: CountryData) =>
          c.groups.intentional.breakdown.homicide.percentage * 5,
      },
      {
        cause: "🖤 Suicide (×5)",
        getVal: (c: CountryData) =>
          c.groups.intentional.breakdown.suicide.percentage * 5,
      },
    ];

    return radarCategories.map(({ cause, getVal }) => ({
      cause,
      ...Object.fromEntries(selectedCountries.map((c) => [c.name, getVal(c)])),
    }));
  }, [selectedCountries]);

  // Analytical callouts
  const getRelativeRatio = (valA: number, valB: number) => {
    if (valB === 0) return valA > 0 ? "∞" : "1.0";
    return (valA / valB).toFixed(1);
  };

  const highestHomicide =
    selectedCountries.length > 0
      ? selectedCountries.reduce((prev, curr) =>
          curr.rates_per_100k.homicide > prev.rates_per_100k.homicide
            ? curr
            : prev
        )
      : null;

  const lowestHomicide =
    selectedCountries.length > 0
      ? selectedCountries.reduce((prev, curr) =>
          curr.rates_per_100k.homicide < prev.rates_per_100k.homicide
            ? curr
            : prev
        )
      : null;

  const highestSenescence =
    selectedCountries.length > 0
      ? selectedCountries.reduce((prev, curr) =>
          curr.rates_per_100k.senescence > prev.rates_per_100k.senescence
            ? curr
            : prev
        )
      : null;

  const lowestSenescence =
    selectedCountries.length > 0
      ? selectedCountries.reduce((prev, curr) =>
          curr.rates_per_100k.senescence < prev.rates_per_100k.senescence
            ? curr
            : prev
        )
      : null;

  const highestTransport =
    selectedCountries.length > 0
      ? selectedCountries.reduce((prev, curr) =>
          curr.rates_per_100k.transport > prev.rates_per_100k.transport
            ? curr
            : prev
        )
      : null;

  const lowestTransport =
    selectedCountries.length > 0
      ? selectedCountries.reduce((prev, curr) =>
          curr.rates_per_100k.transport < prev.rates_per_100k.transport
            ? curr
            : prev
        )
      : null;

  const hasEstimatedData = selectedCountries.some(
    (c) => c.data_confidence !== "high"
  );

  // Helper to render cause rows
  const renderCauseRow = (
    label: string,
    extractor: (c: CountryData) => {
      total: number;
      percentage: number;
      rate: number;
    },
    colorClass = "text-foreground"
  ) => (
    <tr className="hover:bg-muted/40 transition-colors">
      <td className="p-3 font-semibold text-foreground font-sans sticky left-0 bg-card/95 z-10 border-r border-border/40 whitespace-nowrap">
        {label}
      </td>
      {selectedCountries.map((c) => {
        const stats = extractor(c);
        return (
          <td key={c.id} className={`p-3 font-mono ${colorClass}`}>
            {metricMode === "per_100k" ? (
              <div>
                <strong>{stats.rate}</strong>{" "}
                <span className="text-[10px] text-muted-foreground">
                  / 100k
                </span>
                <span className="block text-[10px] text-muted-foreground">
                  ({stats.percentage}% • {stats.total.toLocaleString()} deaths)
                </span>
              </div>
            ) : (
              <div>
                <strong>{stats.percentage}%</strong>
                <span className="block text-[10px] text-muted-foreground">
                  ({stats.rate} / 100k • {stats.total.toLocaleString()} deaths)
                </span>
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );

  // Helper to render group total subtotal rows
  const renderGroupTotalRow = (
    groupName: string,
    groupEmoji: string,
    groupKey: "natural" | "accidental" | "intentional",
    bgColor: string,
    textColor: string
  ) => (
    <tr
      className={`${bgColor} font-sans font-bold border-y-2 border-border/60`}
    >
      <td
        className={`p-3 ${textColor} sticky left-0 bg-card/95 z-10 border-r border-border/40 whitespace-nowrap`}
      >
        <div className="flex items-center justify-between gap-2">
          <span>
            {groupEmoji} ∑ TOTAL {groupName.toUpperCase()}
          </span>
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-mono py-0 ml-1"
          >
            Subtotal
          </Badge>
        </div>
      </td>
      {selectedCountries.map((c) => {
        const group = c.groups[groupKey];
        return (
          <td key={c.id} className={`p-3 font-mono ${textColor}`}>
            <div className="font-extrabold text-sm">
              {metricMode === "per_100k"
                ? `${group.rate_per_100k} / 100k`
                : `${group.percentage}%`}
            </div>
            <div className="text-[10px] opacity-80">
              {group.total.toLocaleString()} total deaths
              {metricMode === "per_100k"
                ? ` (${group.percentage}%)`
                : ` (${group.rate_per_100k} / 100k)`}
            </div>
          </td>
        );
      })}
    </tr>
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
          Juxtapose multiple sovereign nations side-by-side using flag
          visualizers, category emojis, full cause taxonomies, aggregate cohort
          sums, and normalized{" "}
          <strong>per capita rates per 100,000 residents</strong>.
        </p>
      </div>

      {/* Dynamic Multi-Country Management Panel */}
      <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold font-mono text-foreground flex items-center gap-2">
              <span>Active Comparison Jurisdictions</span>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedCountries.length}{" "}
                {selectedCountries.length === 1 ? "Country" : "Countries"}
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground">
              Add or remove countries to compare. Each receives a distinctive
              color across charts and matrices.
            </p>
          </div>

          {/* Add Country Dropdown */}
          <div className="w-full lg:w-80">
            <CustomSelect
              key={addSelectKey}
              options={availableOptions}
              value=""
              onChange={addCountry}
              placeholder="+ Add country to compare..."
              prefixIcon={<Plus className="size-3.5 text-primary" />}
              size="default"
            />
          </div>
        </div>

        {/* Selected Country Badges / Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {selectedCountries.map((c, idx) => {
            const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
            return (
              <div
                key={c.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-background/80 shadow-xs transition-all"
                style={{ borderColor: `${color}60` }}
              >
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span
                  className="text-base leading-none"
                  role="img"
                  aria-label={c.name}
                >
                  {c.flag}
                </span>
                <span className="text-xs font-bold font-mono text-foreground">
                  {c.name}
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono py-0 px-1.5"
                  style={{ color: color, borderColor: `${color}40` }}
                >
                  {c.score} pts
                </Badge>
                <button
                  type="button"
                  onClick={() => removeCountry(c.id)}
                  disabled={selectedCountries.length <= 1}
                  title={
                    selectedCountries.length <= 1
                      ? "At least one country required"
                      : `Remove ${c.name}`
                  }
                  className="text-muted-foreground hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                  aria-label={`Remove ${c.name}`}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/40">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Layers className="size-3" /> Quick Cohorts:
          </span>
          {PRESET_GROUPS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setSelectedIds(preset.ids)}
              className="px-2.5 py-1 text-xs font-mono rounded-md border border-border/60 bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
          {selectedIds.length > 2 && (
            <button
              type="button"
              onClick={() => setSelectedIds(["JPN", "USA", "BRA"])}
              className="px-2.5 py-1 text-xs font-mono rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer flex items-center gap-1 sm:ml-auto"
            >
              <RotateCcw className="size-3" /> Reset Default
            </button>
          )}
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

      {/* THREE MORTALITY GROUPS: TOTAL SUMS & COHORT AGGREGATES */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/40">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-primary uppercase tracking-wider">
              <Sigma className="size-3.5" />
              <span>Mortality Pillar Aggregates</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-foreground">
              Total Sum for Each of the 3 Groups
            </h2>
          </div>
          <div className="text-xs text-muted-foreground font-mono bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40">
            Combined Population:{" "}
            <strong className="text-foreground">
              {(cohortTotals.totalPopulation / 1_000_000).toFixed(1)}M
            </strong>{" "}
            • Total Mortality:{" "}
            <strong className="text-foreground">
              {cohortTotals.totalDeaths.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Natural Group Total Card */}
          <Card className="border-sky-500/30 bg-sky-500/5 p-4 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-sky-400 flex items-center gap-1.5">
                  <span>🧬 1. Natural Deaths</span>
                </span>
                <Badge
                  variant="outline"
                  className="border-sky-500/40 text-sky-400 text-[10px] py-0"
                >
                  Avoidable Weight: 0.60–1.00
                </Badge>
              </div>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-3xl font-black font-mono text-foreground">
                  {cohortTotals.natural.deaths.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  cohort total deaths
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {cohortTotals.natural.pct}% of all cohort deaths •{" "}
                {cohortTotals.natural.rate100k} / 100k residents
              </p>
            </div>

            {/* Per-country breakdown in group */}
            <div className="flex flex-col gap-2 pt-3 border-t border-sky-500/20">
              <span className="text-[11px] font-mono font-semibold text-muted-foreground uppercase">
                Country Totals:
              </span>
              {selectedCountries.map((c, idx) => {
                const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                return (
                  <div key={c.id} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {c.groups.natural.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>{c.groups.natural.percentage}% of deaths</span>
                      <span>{c.groups.natural.rate_per_100k} / 100k</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${c.groups.natural.percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Accidental Group Total Card */}
          <Card className="border-amber-500/30 bg-amber-500/5 p-4 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-amber-400 flex items-center gap-1.5">
                  <span>⚠️ 2. Accidental Trauma</span>
                </span>
                <Badge
                  variant="outline"
                  className="border-amber-500/40 text-amber-400 text-[10px] py-0"
                >
                  Avoidable Weight: 0.20–0.50
                </Badge>
              </div>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-3xl font-black font-mono text-foreground">
                  {cohortTotals.accidental.deaths.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  cohort total deaths
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {cohortTotals.accidental.pct}% of all cohort deaths •{" "}
                {cohortTotals.accidental.rate100k} / 100k residents
              </p>
            </div>

            {/* Per-country breakdown in group */}
            <div className="flex flex-col gap-2 pt-3 border-t border-amber-500/20">
              <span className="text-[11px] font-mono font-semibold text-muted-foreground uppercase">
                Country Totals:
              </span>
              {selectedCountries.map((c, idx) => {
                const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                return (
                  <div key={c.id} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {c.groups.accidental.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>{c.groups.accidental.percentage}% of deaths</span>
                      <span>{c.groups.accidental.rate_per_100k} / 100k</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(c.groups.accidental.percentage * 5, 100)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Intentional Group Total Card */}
          <Card className="border-rose-500/30 bg-rose-500/5 p-4 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-rose-400 flex items-center gap-1.5">
                  <span>⚔️ 3. Intentional Trauma</span>
                </span>
                <Badge
                  variant="outline"
                  className="border-rose-500/40 text-rose-400 text-[10px] py-0"
                >
                  Avoidable Weight: 0.00–0.10
                </Badge>
              </div>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-3xl font-black font-mono text-foreground">
                  {cohortTotals.intentional.deaths.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  cohort total deaths
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {cohortTotals.intentional.pct}% of all cohort deaths •{" "}
                {cohortTotals.intentional.rate100k} / 100k residents
              </p>
            </div>

            {/* Per-country breakdown in group */}
            <div className="flex flex-col gap-2 pt-3 border-t border-rose-500/20">
              <span className="text-[11px] font-mono font-semibold text-muted-foreground uppercase">
                Country Totals:
              </span>
              {selectedCountries.map((c, idx) => {
                const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                return (
                  <div key={c.id} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {c.groups.intentional.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>{c.groups.intentional.percentage}% of deaths</span>
                      <span>{c.groups.intentional.rate_per_100k} / 100k</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(c.groups.intentional.percentage * 10, 100)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Analytical Insights & Relative Ratios Callout */}
      {selectedCountries.length >= 2 &&
        highestHomicide &&
        lowestHomicide &&
        highestSenescence &&
        lowestSenescence &&
        highestTransport &&
        lowestTransport && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border/60 bg-card/60 p-4 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-muted-foreground">
                  🔪 Homicide Max Disparity
                </span>
                <Sparkles className="size-3.5 text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-foreground">
                  {getRelativeRatio(
                    highestHomicide.rates_per_100k.homicide,
                    lowestHomicide.rates_per_100k.homicide
                  )}
                  ×
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {highestHomicide.name} vs {lowestHomicide.name}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {highestHomicide.flag} {highestHomicide.rates_per_100k.homicide}{" "}
                vs {lowestHomicide.flag}{" "}
                {lowestHomicide.rates_per_100k.homicide} per 100k
              </p>
            </Card>

            <Card className="border-border/60 bg-card/60 p-4 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-muted-foreground">
                  ⏳ Senescence Max Disparity
                </span>
                <TrendingUp className="size-3.5 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-foreground">
                  {getRelativeRatio(
                    highestSenescence.rates_per_100k.senescence,
                    lowestSenescence.rates_per_100k.senescence
                  )}
                  ×
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {highestSenescence.name} vs {lowestSenescence.name}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {highestSenescence.flag}{" "}
                {highestSenescence.rates_per_100k.senescence} vs{" "}
                {lowestSenescence.flag}{" "}
                {lowestSenescence.rates_per_100k.senescence} per 100k
              </p>
            </Card>

            <Card className="border-border/60 bg-card/60 p-4 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-muted-foreground">
                  🚗 Transport Max Disparity
                </span>
                <Zap className="size-3.5 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-foreground">
                  {getRelativeRatio(
                    highestTransport.rates_per_100k.transport,
                    lowestTransport.rates_per_100k.transport
                  )}
                  ×
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {highestTransport.name} vs {lowestTransport.name}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {highestTransport.flag}{" "}
                {highestTransport.rates_per_100k.transport} vs{" "}
                {lowestTransport.flag}{" "}
                {lowestTransport.rates_per_100k.transport} per 100k
              </p>
            </Card>
          </div>
        )}

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

      {/* Country Dossier Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {selectedCountries.map((c, idx) => {
          const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
          return (
            <Card
              key={c.id}
              className="border-border/60 bg-card/60 backdrop-blur relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: color }}
              />
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <span
                    className="text-3xl leading-none"
                    role="img"
                    aria-label={`${c.name} Flag`}
                  >
                    {c.flag}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      Rank #{c.rank}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCountry(c.id)}
                      disabled={selectedCountries.length <= 1}
                      title={
                        selectedCountries.length <= 1
                          ? "At least one country required"
                          : `Remove ${c.name}`
                      }
                      className="p-1 rounded-md text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                      aria-label={`Remove ${c.name}`}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
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
                    style={{ color }}
                  >
                    {c.score}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      / 100
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                  <span className="text-muted-foreground">
                    Life Expectancy:
                  </span>
                  <span className="font-bold font-mono text-foreground">
                    {c.life_expectancy} yrs
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                  <span className="text-muted-foreground">
                    Crude Death Rate:
                  </span>
                  <span className="font-bold font-mono text-foreground">
                    {c.crude_death_rate} per 1k
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                  <span className="text-muted-foreground">
                    All-Cause Rate / 100k:
                  </span>
                  <span className="font-bold font-mono text-foreground">
                    {c.rates_per_100k.total}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                  <span className="text-muted-foreground">
                    Homicide Rate / 100k:
                  </span>
                  <span className="font-bold font-mono text-rose-400">
                    {c.rates_per_100k.homicide}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                  <span className="text-muted-foreground">Natural Deaths:</span>
                  <span className="font-bold font-mono text-sky-400">
                    {c.groups.natural.total.toLocaleString()} (
                    {c.groups.natural.percentage}%)
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                  <span className="text-muted-foreground">
                    Accidental Deaths:
                  </span>
                  <span className="font-bold font-mono text-amber-400">
                    {c.groups.accidental.total.toLocaleString()} (
                    {c.groups.accidental.percentage}%)
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                  <span className="text-muted-foreground">
                    Intentional Deaths:
                  </span>
                  <span className="font-bold font-mono text-rose-400">
                    {c.groups.intentional.total.toLocaleString()} (
                    {c.groups.intentional.percentage}%)
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                  <span className="text-muted-foreground">
                    Data Confidence:
                  </span>
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
          );
        })}
      </div>

      {/* Visual Graphs: Group Comparison + External Causes */}
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
              Natural vs Accidental vs Intentional comparative rates.
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
                {selectedCountries.map((c, idx) => (
                  <Bar
                    key={c.id}
                    dataKey={c.name}
                    fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
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
                {selectedCountries.map((c, idx) => (
                  <Bar
                    key={c.id}
                    dataKey={c.name}
                    fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
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
              {selectedCountries.map((c, idx) => {
                const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                return (
                  <Radar
                    key={c.id}
                    name={c.name}
                    dataKey={c.name}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.2}
                  />
                );
              })}
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

      {/* Comprehensive Full Breakdown Table (Both % and Per-Capita) with Group Subtotals */}
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base font-bold font-mono">
            Complete Cause-of-Death Taxonomy & Group Subtotals Matrix
          </CardTitle>
          <CardDescription className="text-xs">
            Examine absolute deaths, proportional shares, per-capita rates per
            100,000 residents, and total sums for each of the 3 mortality
            groups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted text-muted-foreground uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 sticky left-0 bg-muted z-20 min-w-[220px] border-r border-border/60">
                    Cause Classification
                  </th>
                  {selectedCountries.map((c, idx) => {
                    const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                    return (
                      <th
                        key={c.id}
                        className="p-3 min-w-[160px] whitespace-nowrap"
                        style={{ color }}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="flex items-center gap-1.5 font-bold text-xs">
                            <span className="text-base">{c.flag}</span>
                            <span>{c.name}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCountry(c.id)}
                            disabled={selectedCountries.length <= 1}
                            className="p-0.5 rounded text-muted-foreground hover:text-rose-400 cursor-pointer disabled:opacity-20"
                            title={`Remove ${c.name}`}
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {/* 1. NATURAL HEADER */}
                <tr className="bg-sky-500/10 font-sans font-bold text-sky-400">
                  <td
                    colSpan={selectedCountries.length + 1}
                    className="p-2.5 text-xs tracking-wider uppercase"
                  >
                    🧬 PILLAR 1: NATURAL MORTALITY TAXONOMY
                  </td>
                </tr>

                {/* Natural Causes */}
                {renderCauseRow("⏳ Old Age & Senescence", (c) => ({
                  total: c.groups.natural.breakdown.senescence.total,
                  percentage: c.groups.natural.breakdown.senescence.percentage,
                  rate: c.rates_per_100k.senescence,
                }))}
                {renderCauseRow("🎗️ Neoplasms (Cancers)", (c) => ({
                  total: c.groups.natural.breakdown.neoplasms.total,
                  percentage: c.groups.natural.breakdown.neoplasms.percentage,
                  rate: c.rates_per_100k.neoplasms,
                }))}
                {renderCauseRow("🫀 Cardiovascular Diseases", (c) => ({
                  total: c.groups.natural.breakdown.cardiovascular.total,
                  percentage:
                    c.groups.natural.breakdown.cardiovascular.percentage,
                  rate: c.rates_per_100k.cardiovascular,
                }))}
                {renderCauseRow("🫁 Chronic Respiratory", (c) => ({
                  total: c.groups.natural.breakdown.respiratory.total,
                  percentage: c.groups.natural.breakdown.respiratory.percentage,
                  rate: c.rates_per_100k.respiratory,
                }))}
                {renderCauseRow("🧠 Neurodegenerative (Alzheimer's)", (c) => ({
                  total: c.groups.natural.breakdown.neurodegenerative.total,
                  percentage:
                    c.groups.natural.breakdown.neurodegenerative.percentage,
                  rate: c.rates_per_100k.neurodegenerative,
                }))}
                {renderCauseRow("🦠 Infectious & Maternal", (c) => ({
                  total: c.groups.natural.breakdown.infectious_maternal.total,
                  percentage:
                    c.groups.natural.breakdown.infectious_maternal.percentage,
                  rate: c.rates_per_100k.infectious_maternal,
                }))}

                {/* NATURAL GROUP TOTAL SUB-ROW */}
                {renderGroupTotalRow(
                  "Natural Mortality",
                  "🧬",
                  "natural",
                  "bg-sky-500/15 border-sky-500/30",
                  "text-sky-400"
                )}

                {/* 2. ACCIDENTAL HEADER */}
                <tr className="bg-amber-500/10 font-sans font-bold text-amber-400">
                  <td
                    colSpan={selectedCountries.length + 1}
                    className="p-2.5 text-xs tracking-wider uppercase"
                  >
                    ⚠️ PILLAR 2: EXTERNAL ACCIDENTAL TRAUMA TAXONOMY
                  </td>
                </tr>

                {/* Accidental Causes */}
                {renderCauseRow(
                  "🚗 Road & Transport Crashes",
                  (c) => ({
                    total: c.groups.accidental.breakdown.transport.total,
                    percentage:
                      c.groups.accidental.breakdown.transport.percentage,
                    rate: c.rates_per_100k.transport,
                  }),
                  "text-amber-400"
                )}
                {renderCauseRow(
                  "🚧 Occupational Accidents",
                  (c) => ({
                    total: c.groups.accidental.breakdown.occupational.total,
                    percentage:
                      c.groups.accidental.breakdown.occupational.percentage,
                    rate: c.rates_per_100k.occupational,
                  }),
                  "text-amber-400"
                )}
                {renderCauseRow(
                  "🌪️ Natural Disasters",
                  (c) => ({
                    total:
                      c.groups.accidental.breakdown.natural_disasters.total,
                    percentage:
                      c.groups.accidental.breakdown.natural_disasters
                        .percentage,
                    rate: c.rates_per_100k.natural_disasters,
                  }),
                  "text-amber-400"
                )}
                {renderCauseRow(
                  "🩹 Falls, Drowning & Overdoses",
                  (c) => ({
                    total:
                      c.groups.accidental.breakdown.falls_drowning_poisoning
                        .total,
                    percentage:
                      c.groups.accidental.breakdown.falls_drowning_poisoning
                        .percentage,
                    rate: c.rates_per_100k.falls_drowning_poisoning,
                  }),
                  "text-amber-400"
                )}

                {/* ACCIDENTAL GROUP TOTAL SUB-ROW */}
                {renderGroupTotalRow(
                  "Accidental Trauma",
                  "⚠️",
                  "accidental",
                  "bg-amber-500/15 border-amber-500/30",
                  "text-amber-400"
                )}

                {/* 3. INTENTIONAL HEADER */}
                <tr className="bg-rose-500/10 font-sans font-bold text-rose-400">
                  <td
                    colSpan={selectedCountries.length + 1}
                    className="p-2.5 text-xs tracking-wider uppercase"
                  >
                    ⚔️ PILLAR 3: EXTERNAL INTENTIONAL TRAUMA TAXONOMY
                  </td>
                </tr>

                {/* Intentional Causes */}
                {renderCauseRow(
                  "🔪 Interpersonal Homicide",
                  (c) => ({
                    total: c.groups.intentional.breakdown.homicide.total,
                    percentage:
                      c.groups.intentional.breakdown.homicide.percentage,
                    rate: c.rates_per_100k.homicide,
                  }),
                  "text-rose-400"
                )}
                {renderCauseRow(
                  "🖤 Suicide & Self-Harm",
                  (c) => ({
                    total: c.groups.intentional.breakdown.suicide.total,
                    percentage:
                      c.groups.intentional.breakdown.suicide.percentage,
                    rate: c.rates_per_100k.suicide,
                  }),
                  "text-rose-400"
                )}
                {renderCauseRow(
                  "💣 Armed Conflict & War",
                  (c) => ({
                    total: c.groups.intentional.breakdown.conflict_war.total,
                    percentage:
                      c.groups.intentional.breakdown.conflict_war.percentage,
                    rate: c.rates_per_100k.conflict_war,
                  }),
                  "text-rose-400"
                )}

                {/* INTENTIONAL GROUP TOTAL SUB-ROW */}
                {renderGroupTotalRow(
                  "Intentional Trauma",
                  "⚔️",
                  "intentional",
                  "bg-rose-500/15 border-rose-500/30",
                  "text-rose-400"
                )}

                {/* GRAND TOTAL ROW */}
                <tr className="bg-muted font-sans font-bold border-t-2 border-border">
                  <td className="p-3 text-foreground sticky left-0 bg-muted z-10 border-r border-border/60">
                    <div className="flex items-center justify-between">
                      <span>🌐 ∑ ALL-CAUSE TOTAL MORTALITY</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-mono py-0 ml-1"
                      >
                        Grand Total
                      </Badge>
                    </div>
                  </td>
                  {selectedCountries.map((c) => (
                    <td key={c.id} className="p-3 font-mono text-foreground">
                      <div className="font-black text-sm">
                        {c.total_deaths.toLocaleString()} deaths
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Crude: {c.crude_death_rate}‰ • {c.rates_per_100k.total}{" "}
                        / 100k
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
