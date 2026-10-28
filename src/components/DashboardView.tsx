import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  ShieldCheck,
  Activity,
  GitCompare,
  TrendingUp,
  Calendar,
  Users,
  Compass,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>("JPN");
  const [continentFilter, setContinentFilter] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<
    "natural" | "accidental" | "intentional"
  >("natural");

  // Read URL param on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("country");
      if (c && getCountryById(c)) {
        setSelectedId(c.toUpperCase());
      }
    }
  }, []);

  const country: CountryData = getCountryById(selectedId) || countries[0];

  const continents = [
    "All",
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
  ];

  const continentOptions: SelectOption[] = continents.map((c) => ({
    value: c,
    label: c === "All" ? "🌍 All Continents" : c,
  }));

  const filteredCountries = useMemo(() => {
    return countries.filter(
      (c) => continentFilter === "All" || c.continent === continentFilter
    );
  }, [continentFilter]);

  const countrySelectOptions: SelectOption[] = useMemo(() => {
    return filteredCountries.map((c) => ({
      value: c.id,
      label: c.name,
      flag: c.flag,
      badge: `Score: ${c.score}`,
      subtext: `#${c.rank} • ${c.continent}`,
    }));
  }, [filteredCountries]);

  // Group Donut Data
  const groupData = [
    {
      name: "🧬 Natural",
      value: country.groups.natural.percentage,
      color: "#38bdf8",
      total: country.groups.natural.total,
      rate: country.groups.natural.rate_per_100k,
    },
    {
      name: "⚠️ Accidental",
      value: country.groups.accidental.percentage,
      color: "#f59e0b",
      total: country.groups.accidental.total,
      rate: country.groups.accidental.rate_per_100k,
    },
    {
      name: "⚔️ Intentional",
      value: country.groups.intentional.percentage,
      color: "#ef4444",
      total: country.groups.intentional.total,
      rate: country.groups.intentional.rate_per_100k,
    },
  ];

  // Detailed Subcategory comparison data
  const subcategoryData = [
    {
      name: "⏳ Senescence",
      countryVal: country.groups.natural.breakdown.senescence.percentage,
      globalVal: 5.2,
    },
    {
      name: "🎗️ Cancer",
      countryVal: country.groups.natural.breakdown.neoplasms.percentage,
      globalVal: 22.0,
    },
    {
      name: "🫀 Cardio",
      countryVal: country.groups.natural.breakdown.cardiovascular.percentage,
      globalVal: 32.5,
    },
    {
      name: "🫁 Respiratory",
      countryVal: country.groups.natural.breakdown.respiratory.percentage,
      globalVal: 7.8,
    },
    {
      name: "🧠 Neuro",
      countryVal: country.groups.natural.breakdown.neurodegenerative.percentage,
      globalVal: 6.5,
    },
    {
      name: "🦠 Infectious",
      countryVal:
        country.groups.natural.breakdown.infectious_maternal.percentage,
      globalVal: 18.6,
    },
    {
      name: "🚗 Transport",
      countryVal: country.groups.accidental.breakdown.transport.percentage,
      globalVal: 1.8,
    },
    {
      name: "🔪 Homicide",
      countryVal: country.groups.intentional.breakdown.homicide.percentage,
      globalVal: 0.7,
    },
    {
      name: "🖤 Suicide",
      countryVal: country.groups.intentional.breakdown.suicide.percentage,
      globalVal: 1.1,
    },
    {
      name: "💣 War/Conflict",
      countryVal: country.groups.intentional.breakdown.conflict_war.percentage,
      globalVal: 0.4,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header & Country Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/60">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-2xl bg-card border border-border flex items-center justify-center text-4xl shadow-md shrink-0">
            {country.flag}
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider font-mono mb-1">
              <Activity className="size-3.5" />
              <span>Sovereign Mortality Profile (2025)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono flex items-center gap-2">
              <span>{country.name}</span>
              <span className="text-xs font-mono font-normal text-muted-foreground px-2 py-0.5 rounded bg-muted border border-border">
                {country.id}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {country.region} • {country.continent} • Population:{" "}
              {(country.population / 1_000_000).toFixed(2)}M
            </p>
          </div>
        </div>

        {/* Toolbar with Custom Selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Continent CustomSelect */}
          <div className="w-full sm:w-44">
            <CustomSelect
              options={continentOptions}
              value={continentFilter}
              onChange={(v) => setContinentFilter(v)}
              searchable={false}
              size="default"
              prefixIcon={<Compass className="size-3.5" />}
            />
          </div>

          {/* Country CustomSelect */}
          <div className="w-full sm:w-64">
            <CustomSelect
              options={countrySelectOptions}
              value={selectedId}
              onChange={(v) => setSelectedId(v)}
              size="default"
            />
          </div>

          {/* Quick Compare Button */}
          <a href={`/deathatlas/compare?c1=${country.id}`}>
            <Button
              variant="outline"
              size="default"
              className="gap-2 font-semibold w-full sm:w-auto shadow-sm"
            >
              <GitCompare className="size-3.5" />
              Compare
            </Button>
          </a>
        </div>
      </div>

      {/* ESTIMATE BANNER (Required for low/medium or conflict zones) */}
      {country.data_confidence !== "high" && (
        <Alert
          variant={country.data_confidence === "low" ? "warning" : "info"}
          className="border-amber-500/40 bg-amber-500/10"
        >
          <AlertTriangle className="size-4" />
          <AlertTitle className="font-bold flex items-center gap-2 text-xs sm:text-sm">
            <span>
              ⚠️ Demographic Projection Notice: Estimated 2025 Data (
              {country.data_confidence.toUpperCase()} Confidence)
            </span>
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 leading-relaxed">
            {country.confidence_note ||
              "Civil registration and vital statistics (CRVS) coverage in this jurisdiction is partial. 2025 mortality rates are synthesized using UN Population Division WPP 2024, WHO Global Health Estimates, and international humanitarian monitors."}
            <span className="block mt-1">
              <a
                href="/deathatlas/methodology#confidence-tiers"
                className="font-semibold underline hover:text-foreground inline-flex items-center gap-1"
              >
                Read full methodology on synthetic estimation protocols →
              </a>
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Country Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-primary/40 bg-primary/5 shadow-sm">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Atlas Score</span>
              <span>🏆 #{country.rank}</span>
            </CardDescription>
            <CardTitle className="text-3xl font-black text-primary font-mono">
              {country.score}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-[11px] text-muted-foreground">
              0 (violence) to 100 (longevity)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Total Deaths</span>
              <Calendar className="size-3 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground font-mono">
              {country.total_deaths.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-[11px] text-muted-foreground">
              Total 2025 mortality burden
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Per-Capita Rate</span>
              <Users className="size-3 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground font-mono">
              {country.rates_per_100k.total}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-[11px] text-muted-foreground">
              Deaths per 100k ({country.crude_death_rate}/1k)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Life Expectancy</span>
              <TrendingUp className="size-3 text-emerald-400" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground font-mono">
              {country.life_expectancy}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                yrs
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-[11px] text-muted-foreground">
              Lifespan at birth (2025)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Data Quality Tier
            </CardDescription>
            <CardTitle className="text-xl font-bold capitalize text-foreground flex items-center gap-1.5 font-mono">
              {country.data_confidence === "high" ? (
                <ShieldCheck className="size-5 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="size-5 text-amber-500 shrink-0" />
              )}
              {country.data_confidence}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-[11px] text-muted-foreground truncate">
              {country.data_confidence === "high"
                ? "Universal CRVS registration"
                : "Demographic model estimate"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Graphs: 3 Groups Doughnut + Subcategory Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3 Group Proportion Donut */}
        <Card className="border-border/60 bg-card/60 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
              <span>Mortality Triad</span>
              <span className="text-sm font-normal text-muted-foreground">
                ({country.name})
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Natural vs Accidental vs Intentional distribution.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="size-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={groupData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {groupData.map((e, idx) => (
                      <Cell key={`donut-${idx}`} fill={e.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val}%`, name]}
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

            <div className="w-full flex flex-col gap-2 mt-2">
              {groupData.map((g) => (
                <div
                  key={g.name}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/40"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: g.color }}
                    />
                    <span className="font-semibold text-foreground">
                      {g.name}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold">{g.value}%</span>
                    <span className="text-[10px] text-muted-foreground block">
                      {g.rate} / 100k ({g.total.toLocaleString()} deaths)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subcategory Benchmark Bar Chart */}
        <Card className="lg:col-span-2 border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono">
              Key Causes vs Global Average (% of Total Deaths)
            </CardTitle>
            <CardDescription className="text-xs">
              Comparing {country.flag} {country.name} (Blue) against global 2025
              benchmark averages (Slate).
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subcategoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <XAxis type="number" unit="%" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val}%`,
                    name === "countryVal" ? country.name : "Global Benchmark",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  formatter={(val) =>
                    val === "countryVal" ? country.name : "Global Benchmark"
                  }
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Bar
                  dataKey="countryVal"
                  fill="#38bdf8"
                  radius={[0, 4, 4, 0]}
                  name="countryVal"
                />
                <Bar
                  dataKey="globalVal"
                  fill="#64748b"
                  opacity={0.5}
                  radius={[0, 4, 4, 0]}
                  name="globalVal"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Group Explorer Tabs */}
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold font-mono">
                Comprehensive Cause-of-Death Taxonomy
              </CardTitle>
              <CardDescription className="text-xs">
                Detailed breakdowns including per-capita mortality rates per
                100,000 population.
              </CardDescription>
            </div>

            {/* Custom Tab buttons */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("natural")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "natural"
                    ? "bg-card text-sky-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🧬 Natural ({country.groups.natural.percentage}%)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("accidental")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "accidental"
                    ? "bg-card text-amber-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ⚠️ Accidental ({country.groups.accidental.percentage}%)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("intentional")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "intentional"
                    ? "bg-card text-rose-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ⚔️ Intentional ({country.groups.intentional.percentage}%)
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "natural" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CauseMetricCard
                emoji="⏳"
                title="Old Age & Senescence"
                percentage={
                  country.groups.natural.breakdown.senescence.percentage
                }
                rate100k={country.rates_per_100k.senescence}
                total={country.groups.natural.breakdown.senescence.total}
                weight={1.0}
                desc="Natural biological lifespan culmination without premature organ pathology."
                color="sky"
              />
              <CauseMetricCard
                emoji="🎗️"
                title="Neoplasms (Cancers)"
                percentage={
                  country.groups.natural.breakdown.neoplasms.percentage
                }
                rate100k={country.rates_per_100k.neoplasms}
                total={country.groups.natural.breakdown.neoplasms.total}
                weight={0.7}
                desc="Malignant tumors including lung, colorectal, breast, and prostate cancers."
                color="sky"
              />
              <CauseMetricCard
                emoji="🫀"
                title="Cardiovascular Diseases"
                percentage={
                  country.groups.natural.breakdown.cardiovascular.percentage
                }
                rate100k={country.rates_per_100k.cardiovascular}
                total={country.groups.natural.breakdown.cardiovascular.total}
                weight={0.65}
                desc="Ischaemic heart disease, stroke, hypertension, and arterial failure."
                color="sky"
              />
              <CauseMetricCard
                emoji="🫁"
                title="Chronic Respiratory"
                percentage={
                  country.groups.natural.breakdown.respiratory.percentage
                }
                rate100k={country.rates_per_100k.respiratory}
                total={country.groups.natural.breakdown.respiratory.total}
                weight={0.55}
                desc="COPD, chronic asthma, occupational lung diseases, and fibrosis."
                color="sky"
              />
              <CauseMetricCard
                emoji="🧠"
                title="Neurodegenerative (Alzheimer's)"
                percentage={
                  country.groups.natural.breakdown.neurodegenerative.percentage
                }
                rate100k={country.rates_per_100k.neurodegenerative}
                total={country.groups.natural.breakdown.neurodegenerative.total}
                weight={0.85}
                desc="Alzheimer's disease, Parkinson's, and senile dementia (associated with longevity)."
                color="sky"
              />
              <CauseMetricCard
                emoji="🦠"
                title="Infectious & Communicable"
                percentage={
                  country.groups.natural.breakdown.infectious_maternal
                    .percentage
                }
                rate100k={country.rates_per_100k.infectious_maternal}
                total={
                  country.groups.natural.breakdown.infectious_maternal.total
                }
                weight={0.35}
                desc="Respiratory infections, tuberculosis, malaria, HIV, diarrheal & maternal deaths."
                color="amber"
              />
            </div>
          )}

          {activeTab === "accidental" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CauseMetricCard
                emoji="🚗"
                title="Road & Transport Crashes"
                percentage={
                  country.groups.accidental.breakdown.transport.percentage
                }
                rate100k={country.rates_per_100k.transport}
                total={country.groups.accidental.breakdown.transport.total}
                weight={0.15}
                desc="Motor vehicle collisions, pedestrian impacts, two-wheeler and transit accidents."
                color="amber"
              />
              <CauseMetricCard
                emoji="🚧"
                title="Occupational Hazards"
                percentage={
                  country.groups.accidental.breakdown.occupational.percentage
                }
                rate100k={country.rates_per_100k.occupational}
                total={country.groups.accidental.breakdown.occupational.total}
                weight={0.2}
                desc="Workplace trauma in industrial, construction, agricultural, and mining sectors."
                color="amber"
              />
              <CauseMetricCard
                emoji="🌪️"
                title="Natural Disasters"
                percentage={
                  country.groups.accidental.breakdown.natural_disasters
                    .percentage
                }
                rate100k={country.rates_per_100k.natural_disasters}
                total={
                  country.groups.accidental.breakdown.natural_disasters.total
                }
                weight={0.3}
                desc="Floods, earthquakes, tropical storms, heatwaves, and wildfires."
                color="amber"
              />
              <CauseMetricCard
                emoji="🩹"
                title="Falls, Drowning & Poisoning"
                percentage={
                  country.groups.accidental.breakdown.falls_drowning_poisoning
                    .percentage
                }
                rate100k={country.rates_per_100k.falls_drowning_poisoning}
                total={
                  country.groups.accidental.breakdown.falls_drowning_poisoning
                    .total
                }
                weight={0.18}
                desc="Accidental poisonings (including overdoses), elderly falls, and drownings."
                color="amber"
              />
              <CauseMetricCard
                emoji="⚠️"
                title="Other Accidental Trauma"
                percentage={
                  country.groups.accidental.breakdown.other_accidental
                    .percentage
                }
                rate100k={2.5}
                total={
                  country.groups.accidental.breakdown.other_accidental.total
                }
                weight={0.2}
                desc="Accidental fires, mechanical suffocation, and miscellaneous mishaps."
                color="amber"
              />
            </div>
          )}

          {activeTab === "intentional" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CauseMetricCard
                emoji="🔪"
                title="Interpersonal Homicide"
                percentage={
                  country.groups.intentional.breakdown.homicide.percentage
                }
                rate100k={country.rates_per_100k.homicide}
                total={country.groups.intentional.breakdown.homicide.total}
                weight={0.02}
                desc="Murder, assault with firearms or knives, and violent criminal encounters."
                color="rose"
              />
              <CauseMetricCard
                emoji="🖤"
                title="Suicide & Self-Harm"
                percentage={
                  country.groups.intentional.breakdown.suicide.percentage
                }
                rate100k={country.rates_per_100k.suicide}
                total={country.groups.intentional.breakdown.suicide.total}
                weight={0.06}
                desc="Intentional self-inflicted fatal trauma and psychiatric-related deaths."
                color="rose"
              />
              <CauseMetricCard
                emoji="💣"
                title="Armed Conflict & War"
                percentage={
                  country.groups.intentional.breakdown.conflict_war.percentage
                }
                rate100k={country.rates_per_100k.conflict_war}
                total={country.groups.intentional.breakdown.conflict_war.total}
                weight={0.0}
                desc="Direct combatant and civilian casualties in state and non-state warfare."
                color="rose"
              />
              <CauseMetricCard
                emoji="💥"
                title="Terrorism & Group Violence"
                percentage={
                  country.groups.intentional.breakdown.terrorism.percentage
                }
                rate100k={country.rates_per_100k.terrorism}
                total={country.groups.intentional.breakdown.terrorism.total}
                weight={0.0}
                desc="Terrorist bombings, mass shootings, and collective militant attacks."
                color="rose"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface CauseMetricCardProps {
  emoji: string;
  title: string;
  percentage: number;
  rate100k: number;
  total: number;
  weight: number;
  desc: string;
  color: "sky" | "amber" | "rose";
}

const CauseMetricCard: React.FC<CauseMetricCardProps> = ({
  emoji,
  title,
  percentage,
  rate100k,
  total,
  weight,
  desc,
  color,
}) => {
  const colorMap = {
    sky: "border-sky-500/20 bg-sky-500/5 text-sky-400",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    rose: "border-rose-500/20 bg-rose-500/5 text-rose-400",
  };

  return (
    <div
      className={`p-4 rounded-xl border ${colorMap[color]} flex flex-col justify-between gap-3`}
    >
      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
            <span role="img" aria-hidden="true">
              {emoji}
            </span>
            <span>{title}</span>
          </h4>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            w: {weight.toFixed(2)}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
          {desc}
        </p>
      </div>

      <div className="flex flex-col gap-1 border-t border-border/40 pt-2 font-mono">
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-foreground">
            {percentage}%
          </span>
          <span className="text-xs font-bold text-primary">
            {rate100k}{" "}
            <span className="text-[10px] text-muted-foreground">/ 100k</span>
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {total.toLocaleString()} deaths annually
        </span>
      </div>
    </div>
  );
};
