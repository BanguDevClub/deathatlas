import React, { useState, useEffect } from "react";
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
import { GitCompare, AlertTriangle, ArrowRight, X } from "lucide-react";

export const CompareView: React.FC = () => {
  const [c1Id, setC1Id] = useState<string>("JPN");
  const [c2Id, setC2Id] = useState<string>("USA");
  const [c3Id, setC3Id] = useState<string>("BRA");

  // Load from URL params if available
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

  // Colors for countries
  const colors = ["#38bdf8", "#ca9ee6", "#f59e0b"];

  // Bar Chart Data (3 groups)
  const groupCompareData = [
    {
      group: "Natural Deaths",
      [c1.name]: c1.groups.natural.percentage,
      [c2.name]: c2.groups.natural.percentage,
      ...(c3 ? { [c3.name]: c3.groups.natural.percentage } : {}),
    },
    {
      group: "Accidental Trauma",
      [c1.name]: c1.groups.accidental.percentage,
      [c2.name]: c2.groups.accidental.percentage,
      ...(c3 ? { [c3.name]: c3.groups.accidental.percentage } : {}),
    },
    {
      group: "Intentional Deaths",
      [c1.name]: c1.groups.intentional.percentage,
      [c2.name]: c2.groups.intentional.percentage,
      ...(c3 ? { [c3.name]: c3.groups.intentional.percentage } : {}),
    },
  ];

  // Radar Chart Data (Multi-axis cause breakdown)
  const radarData = [
    {
      cause: "Senescence",
      [c1.name]: c1.groups.natural.breakdown.senescence.percentage,
      [c2.name]: c2.groups.natural.breakdown.senescence.percentage,
      ...(c3
        ? { [c3.name]: c3.groups.natural.breakdown.senescence.percentage }
        : {}),
    },
    {
      cause: "Neoplasms",
      [c1.name]: c1.groups.natural.breakdown.neoplasms.percentage,
      [c2.name]: c2.groups.natural.breakdown.neoplasms.percentage,
      ...(c3
        ? { [c3.name]: c3.groups.natural.breakdown.neoplasms.percentage }
        : {}),
    },
    {
      cause: "Cardiovascular",
      [c1.name]: c1.groups.natural.breakdown.cardiovascular.percentage,
      [c2.name]: c2.groups.natural.breakdown.cardiovascular.percentage,
      ...(c3
        ? { [c3.name]: c3.groups.natural.breakdown.cardiovascular.percentage }
        : {}),
    },
    {
      cause: "Infectious",
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
      cause: "Transport",
      [c1.name]: c1.groups.accidental.breakdown.transport.percentage * 5, // scaled for radar visibility
      [c2.name]: c2.groups.accidental.breakdown.transport.percentage * 5,
      ...(c3
        ? { [c3.name]: c3.groups.accidental.breakdown.transport.percentage * 5 }
        : {}),
    },
    {
      cause: "Homicide",
      [c1.name]: c1.groups.intentional.breakdown.homicide.percentage * 5, // scaled
      [c2.name]: c2.groups.intentional.breakdown.homicide.percentage * 5,
      ...(c3
        ? { [c3.name]: c3.groups.intentional.breakdown.homicide.percentage * 5 }
        : {}),
    },
    {
      cause: "Suicide",
      [c1.name]: c1.groups.intentional.breakdown.suicide.percentage * 5, // scaled
      [c2.name]: c2.groups.intentional.breakdown.suicide.percentage * 5,
      ...(c3
        ? { [c3.name]: c3.groups.intentional.breakdown.suicide.percentage * 5 }
        : {}),
    },
  ];

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
          Compare Country Mortality Profiles
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Select two or three sovereign nations to juxtapose their 2025
          cause-of-death signatures, longevity scores, and trauma
          vulnerabilities.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur">
        {/* Country 1 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-sky-400 font-mono uppercase tracking-wider">
            Country 1 (Primary)
          </label>
          <select
            value={c1Id}
            onChange={(e) => setC1Id(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          >
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.rank} {c.name} ({c.continent})
              </option>
            ))}
          </select>
        </div>

        {/* Country 2 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-purple-400 font-mono uppercase tracking-wider">
            Country 2 (Comparison)
          </label>
          <select
            value={c2Id}
            onChange={(e) => setC2Id(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          >
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.rank} {c.name} ({c.continent})
              </option>
            ))}
          </select>
        </div>

        {/* Country 3 (Optional) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-wider">
              Country 3 (Optional)
            </label>
            {c3Id && (
              <button
                onClick={() => setC3Id("")}
                className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 cursor-pointer"
              >
                <X className="size-3" /> Clear
              </button>
            )}
          </div>
          <select
            value={c3Id}
            onChange={(e) => setC3Id(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          >
            <option value="">-- None --</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.rank} {c.name} ({c.continent})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notice if any country is an estimate */}
      {hasEstimatedData && (
        <Alert
          variant="warning"
          className="border-amber-500/30 bg-amber-500/10"
        >
          <AlertTriangle className="size-4" />
          <AlertTitle className="text-xs font-bold">
            Note on Synthetic Estimates
          </AlertTitle>
          <AlertDescription className="text-xs mt-1">
            One or more of the selected nations has partial civil registration
            or active conflict conditions. Projections are synthesized from UN
            WPP, WHO, and crisis monitors.
          </AlertDescription>
        </Alert>
      )}

      {/* Side-by-Side Stat Cards */}
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
                <Badge
                  variant="outline"
                  style={{
                    color: colors[idx],
                    borderColor: `${colors[idx]}50`,
                  }}
                >
                  {c.id}
                </Badge>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  Global Rank #{c.rank}
                </span>
              </div>
              <CardTitle className="text-xl font-bold font-mono mt-1 text-foreground">
                {c.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {c.continent} • Pop: {(c.population / 1_000_000).toFixed(2)}M
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground font-mono">
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
              <div className="flex items-baseline justify-between border-t border-border/40 pt-2 text-xs">
                <span className="text-muted-foreground">Life Expectancy:</span>
                <span className="font-bold font-mono text-foreground">
                  {c.life_expectancy} yrs
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/40 pt-2 text-xs">
                <span className="text-muted-foreground">Crude Death Rate:</span>
                <span className="font-bold font-mono text-foreground">
                  {c.crude_death_rate} per 1k
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/40 pt-2 text-xs">
                <span className="text-muted-foreground">
                  Total Deaths (2025):
                </span>
                <span className="font-bold font-mono text-foreground">
                  {c.total_deaths.toLocaleString()}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/40 pt-2 text-xs">
                <span className="text-muted-foreground">
                  Intentional Violence %:
                </span>
                <span className="font-bold font-mono text-rose-400">
                  {c.groups.intentional.percentage}%
                </span>
              </div>
              <div className="pt-2">
                <a href={`/deathatlas/dashboard?country=${c.id}`}>
                  <Button
                    variant="ghost"
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

      {/* Visual Graphs: Bar comparison + Radar comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3 Groups Comparison Bar Chart */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono">
              The Three Mortality Groups Comparison
            </CardTitle>
            <CardDescription className="text-xs">
              Natural vs Accidental vs Intentional percentage share.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={groupCompareData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="group" tick={{ fontSize: 11 }} />
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

        {/* Radar Comparison Chart */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono">
              Multi-Dimensional Cause Radar
            </CardTitle>
            <CardDescription className="text-xs">
              Relative profiles across key biological and external causes.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="cause"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
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
      </div>

      {/* Side-by-Side Detailed Breakdown Table */}
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base font-bold font-mono">
            Direct Cause-of-Death Taxonomy Comparison
          </CardTitle>
          <CardDescription className="text-xs">
            Subcategory percentages and absolute figures side-by-side.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Cause Classification</th>
                  <th className="p-3" style={{ color: colors[0] }}>
                    {c1.name}
                  </th>
                  <th className="p-3" style={{ color: colors[1] }}>
                    {c2.name}
                  </th>
                  {c3 && (
                    <th className="p-3" style={{ color: colors[2] }}>
                      {c3.name}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 font-semibold text-foreground">
                    Old Age & Senescence
                  </td>
                  <td className="p-3 font-mono">
                    {c1.groups.natural.breakdown.senescence.percentage}% (
                    {c1.groups.natural.breakdown.senescence.total.toLocaleString()}
                    )
                  </td>
                  <td className="p-3 font-mono">
                    {c2.groups.natural.breakdown.senescence.percentage}% (
                    {c2.groups.natural.breakdown.senescence.total.toLocaleString()}
                    )
                  </td>
                  {c3 && (
                    <td className="p-3 font-mono">
                      {c3.groups.natural.breakdown.senescence.percentage}% (
                      {c3.groups.natural.breakdown.senescence.total.toLocaleString()}
                      )
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground">
                    Neoplasms (Cancers)
                  </td>
                  <td className="p-3 font-mono">
                    {c1.groups.natural.breakdown.neoplasms.percentage}% (
                    {c1.groups.natural.breakdown.neoplasms.total.toLocaleString()}
                    )
                  </td>
                  <td className="p-3 font-mono">
                    {c2.groups.natural.breakdown.neoplasms.percentage}% (
                    {c2.groups.natural.breakdown.neoplasms.total.toLocaleString()}
                    )
                  </td>
                  {c3 && (
                    <td className="p-3 font-mono">
                      {c3.groups.natural.breakdown.neoplasms.percentage}% (
                      {c3.groups.natural.breakdown.neoplasms.total.toLocaleString()}
                      )
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground">
                    Cardiovascular Diseases
                  </td>
                  <td className="p-3 font-mono">
                    {c1.groups.natural.breakdown.cardiovascular.percentage}% (
                    {c1.groups.natural.breakdown.cardiovascular.total.toLocaleString()}
                    )
                  </td>
                  <td className="p-3 font-mono">
                    {c2.groups.natural.breakdown.cardiovascular.percentage}% (
                    {c2.groups.natural.breakdown.cardiovascular.total.toLocaleString()}
                    )
                  </td>
                  {c3 && (
                    <td className="p-3 font-mono">
                      {c3.groups.natural.breakdown.cardiovascular.percentage}% (
                      {c3.groups.natural.breakdown.cardiovascular.total.toLocaleString()}
                      )
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground">
                    Infectious & Communicable
                  </td>
                  <td className="p-3 font-mono">
                    {c1.groups.natural.breakdown.infectious_maternal.percentage}
                    % (
                    {c1.groups.natural.breakdown.infectious_maternal.total.toLocaleString()}
                    )
                  </td>
                  <td className="p-3 font-mono">
                    {c2.groups.natural.breakdown.infectious_maternal.percentage}
                    % (
                    {c2.groups.natural.breakdown.infectious_maternal.total.toLocaleString()}
                    )
                  </td>
                  {c3 && (
                    <td className="p-3 font-mono">
                      {
                        c3.groups.natural.breakdown.infectious_maternal
                          .percentage
                      }
                      % (
                      {c3.groups.natural.breakdown.infectious_maternal.total.toLocaleString()}
                      )
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground">
                    Road & Transport Crashes
                  </td>
                  <td className="p-3 font-mono text-amber-400">
                    {c1.groups.accidental.breakdown.transport.percentage}% (
                    {c1.groups.accidental.breakdown.transport.total.toLocaleString()}
                    )
                  </td>
                  <td className="p-3 font-mono text-amber-400">
                    {c2.groups.accidental.breakdown.transport.percentage}% (
                    {c2.groups.accidental.breakdown.transport.total.toLocaleString()}
                    )
                  </td>
                  {c3 && (
                    <td className="p-3 font-mono text-amber-400">
                      {c3.groups.accidental.breakdown.transport.percentage}% (
                      {c3.groups.accidental.breakdown.transport.total.toLocaleString()}
                      )
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground">
                    Homicide & Violent Crime
                  </td>
                  <td className="p-3 font-mono text-rose-400">
                    {c1.groups.intentional.breakdown.homicide.percentage}% (
                    {c1.groups.intentional.breakdown.homicide.total.toLocaleString()}
                    )
                  </td>
                  <td className="p-3 font-mono text-rose-400">
                    {c2.groups.intentional.breakdown.homicide.percentage}% (
                    {c2.groups.intentional.breakdown.homicide.total.toLocaleString()}
                    )
                  </td>
                  {c3 && (
                    <td className="p-3 font-mono text-rose-400">
                      {c3.groups.intentional.breakdown.homicide.percentage}% (
                      {c3.groups.intentional.breakdown.homicide.total.toLocaleString()}
                      )
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground">
                    Suicide & Self-Harm
                  </td>
                  <td className="p-3 font-mono text-rose-400">
                    {c1.groups.intentional.breakdown.suicide.percentage}% (
                    {c1.groups.intentional.breakdown.suicide.total.toLocaleString()}
                    )
                  </td>
                  <td className="p-3 font-mono text-rose-400">
                    {c2.groups.intentional.breakdown.suicide.percentage}% (
                    {c2.groups.intentional.breakdown.suicide.total.toLocaleString()}
                    )
                  </td>
                  {c3 && (
                    <td className="p-3 font-mono text-rose-400">
                      {c3.groups.intentional.breakdown.suicide.percentage}% (
                      {c3.groups.intentional.breakdown.suicide.total.toLocaleString()}
                      )
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground">
                    Armed Conflict & War
                  </td>
                  <td className="p-3 font-mono text-rose-400">
                    {c1.groups.intentional.breakdown.conflict_war.percentage}% (
                    {c1.groups.intentional.breakdown.conflict_war.total.toLocaleString()}
                    )
                  </td>
                  <td className="p-3 font-mono text-rose-400">
                    {c2.groups.intentional.breakdown.conflict_war.percentage}% (
                    {c2.groups.intentional.breakdown.conflict_war.total.toLocaleString()}
                    )
                  </td>
                  {c3 && (
                    <td className="p-3 font-mono text-rose-400">
                      {c3.groups.intentional.breakdown.conflict_war.percentage}%
                      (
                      {c3.groups.intentional.breakdown.conflict_war.total.toLocaleString()}
                      )
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
