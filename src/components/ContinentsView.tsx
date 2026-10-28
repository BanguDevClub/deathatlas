import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { countries } from "@/lib/data";
import type { CountryData } from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe2, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";

interface ContinentSummary {
  name: string;
  countryCount: number;
  population: number;
  totalDeaths: number;
  avgScore: number;
  avgNaturalPct: number;
  avgAccidentalPct: number;
  avgIntentionalPct: number;
  highestCountry: CountryData;
  lowestCountry: CountryData;
  countries: CountryData[];
}

export const ContinentsView: React.FC = () => {
  const continentNames = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
  ];

  const summaries: ContinentSummary[] = continentNames.map((name) => {
    const list = countries.filter((c) => c.continent === name);
    const pop = list.reduce((acc, c) => acc + c.population, 0);
    const deaths = list.reduce((acc, c) => acc + c.total_deaths, 0);
    const weightedScore =
      list.reduce((acc, c) => acc + c.score * c.total_deaths, 0) / deaths;
    const weightedNat =
      list.reduce(
        (acc, c) => acc + c.groups.natural.percentage * c.total_deaths,
        0
      ) / deaths;
    const weightedAcc =
      list.reduce(
        (acc, c) => acc + c.groups.accidental.percentage * c.total_deaths,
        0
      ) / deaths;
    const weightedInt =
      list.reduce(
        (acc, c) => acc + c.groups.intentional.percentage * c.total_deaths,
        0
      ) / deaths;

    // Sort by score
    const sorted = [...list].sort((a, b) => b.score - a.score);

    return {
      name,
      countryCount: list.length,
      population: pop,
      totalDeaths: deaths,
      avgScore: Number(weightedScore.toFixed(1)),
      avgNaturalPct: Number(weightedNat.toFixed(1)),
      avgAccidentalPct: Number(weightedAcc.toFixed(1)),
      avgIntentionalPct: Number(weightedInt.toFixed(1)),
      highestCountry: sorted[0],
      lowestCountry: sorted[sorted.length - 1],
      countries: sorted,
    };
  });

  const [selectedContinent, setSelectedContinent] = useState<string>("Europe");
  const currentSummary =
    summaries.find((s) => s.name === selectedContinent) || summaries[0];

  // Chart data
  const chartData = summaries.map((s) => ({
    name: s.name,
    Score: s.avgScore,
    Natural: s.avgNaturalPct,
    Accidental: s.avgAccidentalPct,
    Intentional: s.avgIntentionalPct,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider font-mono">
          <Globe2 className="size-3.5" />
          <span>Macro-Regional Demographics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
          Continental Mortality Overview
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Compare aggregated longevity scores, accidental vulnerability, and
          intentional conflict rates across the world's 6 continental
          landmasses.
        </p>
      </div>

      {/* Recharts Continental Comparison */}
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base font-bold font-mono">
            Continental Mortality Performance Comparison (2025)
          </CardTitle>
          <CardDescription className="text-xs">
            Weighted metrics across the 6 continents: Atlas Score vs Group
            percentages.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any, name: any) => [`${val}%`, name]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="Score"
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
                name="Death Atlas Score"
              />
              <Bar
                dataKey="Natural"
                fill="#818cf8"
                radius={[4, 4, 0, 0]}
                name="Natural %"
              />
              <Bar
                dataKey="Accidental"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                name="Accidental %"
              />
              <Bar
                dataKey="Intentional"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Intentional %"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Continent Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaries.map((s) => {
          const isSelected = selectedContinent === s.name;
          return (
            <button
              key={s.name}
              onClick={() => setSelectedContinent(s.name)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border/60 bg-card/60 hover:bg-muted"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-foreground block">
                  {s.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {s.countryCount} countries
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/40 pt-1.5">
                <span className="text-[10px] text-muted-foreground">Score</span>
                <span className="text-sm font-bold font-mono text-primary">
                  {s.avgScore}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Continent Deep Dive */}
      <Card className="border-border/60 bg-card/60">
        <CardHeader className="border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold font-mono">
                  {currentSummary.name}
                </CardTitle>
                <Badge variant="outline">
                  {currentSummary.countryCount} Sovereign Nations
                </Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                Total Population:{" "}
                {(currentSummary.population / 1_000_000).toFixed(1)}M • Deaths
                in 2025: {(currentSummary.totalDeaths / 1_000_000).toFixed(2)}M
              </CardDescription>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                🧬 Nat: {currentSummary.avgNaturalPct}%
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                ⚠️ Acc: {currentSummary.avgAccidentalPct}%
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                ⚔️ Int: {currentSummary.avgIntentionalPct}%
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col gap-6">
          {/* Best vs Challenged Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏆 Highest Ranked in {currentSummary.name}</span>
                </span>
                <Badge variant="success">
                  Rank #{currentSummary.highestCountry.rank}
                </Badge>
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span
                    className="text-2xl leading-none"
                    role="img"
                    aria-label="Flag"
                  >
                    {currentSummary.highestCountry.flag}
                  </span>
                  <span>{currentSummary.highestCountry.name}</span>
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Atlas Score:{" "}
                  <strong className="text-foreground">
                    {currentSummary.highestCountry.score}
                  </strong>{" "}
                  • Life Expectancy:{" "}
                  {currentSummary.highestCountry.life_expectancy} yrs •
                  Intentional:{" "}
                  {currentSummary.highestCountry.groups.intentional.percentage}%
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={`/deathatlas/dashboard?country=${currentSummary.highestCountry.id}`}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  View full dossier <ArrowRight className="size-3" />
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚠️ Lowest Ranked in {currentSummary.name}</span>
                </span>
                <Badge variant="warning">
                  Rank #{currentSummary.lowestCountry.rank}
                </Badge>
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span
                    className="text-2xl leading-none"
                    role="img"
                    aria-label="Flag"
                  >
                    {currentSummary.lowestCountry.flag}
                  </span>
                  <span>{currentSummary.lowestCountry.name}</span>
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Atlas Score:{" "}
                  <strong className="text-foreground">
                    {currentSummary.lowestCountry.score}
                  </strong>{" "}
                  • Life Expectancy:{" "}
                  {currentSummary.lowestCountry.life_expectancy} yrs •
                  Intentional:{" "}
                  {currentSummary.lowestCountry.groups.intentional.percentage}%
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={`/deathatlas/dashboard?country=${currentSummary.lowestCountry.id}`}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  View full dossier <ArrowRight className="size-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Table of all countries in this continent */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Life Exp</th>
                  <th className="p-3">Deaths (2025)</th>
                  <th className="p-3">🧬 Natural %</th>
                  <th className="p-3">⚠️ Accidental %</th>
                  <th className="p-3">⚔️ Intentional %</th>
                  <th className="p-3">Data Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentSummary.countries.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-muted-foreground">
                      #{c.rank}
                    </td>
                    <td className="p-3 font-semibold text-foreground">
                      <a
                        href={`/deathatlas/dashboard?country=${c.id}`}
                        className="hover:text-primary transition-colors inline-flex items-center gap-2"
                      >
                        <span
                          className="text-base leading-none"
                          role="img"
                          aria-label="Flag"
                        >
                          {c.flag}
                        </span>
                        <span>{c.name}</span>
                      </a>
                    </td>
                    <td className="p-3 font-mono font-bold text-primary">
                      {c.score}
                    </td>
                    <td className="p-3 font-mono">{c.life_expectancy}y</td>
                    <td className="p-3 font-mono">
                      {c.total_deaths.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-sky-400">
                      {c.groups.natural.percentage}%
                    </td>
                    <td className="p-3 font-mono text-amber-400">
                      {c.groups.accidental.percentage}%
                    </td>
                    <td className="p-3 font-mono text-rose-400">
                      {c.groups.intentional.percentage}%
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] capitalize font-medium ${
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
