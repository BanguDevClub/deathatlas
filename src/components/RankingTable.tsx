import React, { useState, useMemo } from "react";
import { countries } from "@/lib/data";
import type { CountryData } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect, type SelectOption } from "@/components/ui/select";
import {
  Trophy,
  Search,
  Download,
  ArrowUpDown,
  ShieldCheck,
  AlertTriangle,
  Percent,
  Users,
  Compass,
  Filter,
} from "lucide-react";

type SortField =
  | "rank"
  | "name"
  | "score"
  | "life_expectancy"
  | "crude_death_rate"
  | "rate_total"
  | "total_deaths"
  | "natural"
  | "accidental"
  | "intentional";

export const RankingTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("All");
  const [confidence, setConfidence] = useState("All");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<"percentage" | "per_100k">(
    "percentage"
  );

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

  const confidenceOptions: SelectOption[] = [
    { value: "All", label: "🛡️ All Quality Tiers" },
    { value: "high", label: "✅ High Confidence (>90% CRVS)" },
    { value: "medium", label: "⚠️ Medium Confidence" },
    { value: "low", label: "⚠️ Low / Synthetic Estimates" },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === "name" ? true : false);
    }
  };

  const filteredAndSorted = useMemo(() => {
    return countries
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.id.toLowerCase().includes(search.toLowerCase());
        const matchesContinent =
          continent === "All" || c.continent === continent;
        const matchesConfidence =
          confidence === "All" || c.data_confidence === confidence;
        return matchesSearch && matchesContinent && matchesConfidence;
      })
      .sort((a, b) => {
        let valA: any = a[sortField as keyof CountryData];
        let valB: any = b[sortField as keyof CountryData];

        if (sortField === "natural") {
          valA =
            displayMode === "percentage"
              ? a.groups.natural.percentage
              : a.rates_per_100k.natural;
          valB =
            displayMode === "percentage"
              ? b.groups.natural.percentage
              : b.rates_per_100k.natural;
        } else if (sortField === "accidental") {
          valA =
            displayMode === "percentage"
              ? a.groups.accidental.percentage
              : a.rates_per_100k.accidental;
          valB =
            displayMode === "percentage"
              ? b.groups.accidental.percentage
              : b.rates_per_100k.accidental;
        } else if (sortField === "intentional") {
          valA =
            displayMode === "percentage"
              ? a.groups.intentional.percentage
              : a.rates_per_100k.intentional;
          valB =
            displayMode === "percentage"
              ? b.groups.intentional.percentage
              : b.rates_per_100k.intentional;
        } else if (sortField === "rate_total") {
          valA = a.rates_per_100k.total;
          valB = b.rates_per_100k.total;
        }

        if (typeof valA === "string") {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [search, continent, confidence, sortField, sortAsc, displayMode]);

  // Export functions
  const exportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(filteredAndSorted, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `deathatlas-ranking-2025.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = [
      "Rank",
      "ISO",
      "Name",
      "Flag",
      "Continent",
      "DeathAtlasScore",
      "LifeExpectancy",
      "CrudeDeathRate",
      "RatePer100k",
      "TotalDeaths",
      "NaturalPct",
      "NaturalRatePer100k",
      "AccidentalPct",
      "AccidentalRatePer100k",
      "IntentionalPct",
      "IntentionalRatePer100k",
      "HomicideRatePer100k",
      "DataConfidence",
    ];
    const rows = filteredAndSorted.map((c) => [
      c.rank,
      c.id,
      `"${c.name}"`,
      `"${c.flag}"`,
      `"${c.continent}"`,
      c.score,
      c.life_expectancy,
      c.crude_death_rate,
      c.rates_per_100k.total,
      c.total_deaths,
      c.groups.natural.percentage,
      c.rates_per_100k.natural,
      c.groups.accidental.percentage,
      c.rates_per_100k.accidental,
      c.groups.intentional.percentage,
      c.rates_per_100k.intentional,
      c.rates_per_100k.homicide,
      c.data_confidence,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `deathatlas-ranking-2025.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Title & Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider font-mono mb-1">
            <Trophy className="size-3.5" />
            <span>Sovereign Mortality Index</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
            Global 195 Country Ranking
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            All 193 UN Member States + Holy See & Palestine ranked by 2025 Death
            Atlas Longevity & Safety Score.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="gap-2 font-semibold shadow-sm"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportJSON}
            className="gap-2 font-semibold shadow-sm"
          >
            <Download className="size-3.5" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filter Bar (Custom Inputs & Custom Selects) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur shadow-sm">
        {/* Custom Search Input with clear button */}
        <div className="sm:col-span-2">
          <Input
            type="text"
            placeholder="Search by country name, flag, or ISO code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            prefixIcon={<Search className="size-3.5" />}
            inputSize="default"
          />
        </div>

        {/* Continent CustomSelect */}
        <div>
          <CustomSelect
            options={continentOptions}
            value={continent}
            onChange={(v) => setContinent(v)}
            searchable={false}
            size="default"
            prefixIcon={<Compass className="size-3.5" />}
          />
        </div>

        {/* Confidence CustomSelect */}
        <div>
          <CustomSelect
            options={confidenceOptions}
            value={confidence}
            onChange={(v) => setConfidence(v)}
            searchable={false}
            size="default"
            prefixIcon={<Filter className="size-3.5" />}
          />
        </div>
      </div>

      {/* Mode Switcher & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="text-muted-foreground">
          Showing{" "}
          <strong className="text-foreground">
            {filteredAndSorted.length}
          </strong>{" "}
          of {countries.length} nations
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-card border border-border">
          <button
            type="button"
            onClick={() => setDisplayMode("percentage")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              displayMode === "percentage"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Percent className="size-3" />
            <span>% of Deaths</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode("per_100k")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              displayMode === "per_100k"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3" />
            <span>Per 100k Residents</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <Card className="border-border/60 bg-card/60 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/70 text-muted-foreground font-mono text-[10px] uppercase tracking-wider select-none">
              <tr>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("rank")}
                >
                  <div className="flex items-center gap-1">
                    🏆 Rank <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Country <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("score")}
                >
                  <div className="flex items-center gap-1">
                    Atlas Score <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("life_expectancy")}
                >
                  <div className="flex items-center gap-1">
                    Life Exp <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("crude_death_rate")}
                >
                  <div className="flex items-center gap-1">
                    Rate/1k <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("rate_total")}
                >
                  <div className="flex items-center gap-1">
                    Rate/100k <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("total_deaths")}
                >
                  <div className="flex items-center gap-1">
                    Total Deaths <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("natural")}
                >
                  <div className="flex items-center gap-1">
                    🧬 Natural {displayMode === "percentage" ? "%" : "/100k"}{" "}
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("accidental")}
                >
                  <div className="flex items-center gap-1">
                    ⚠️ Accidental {displayMode === "percentage" ? "%" : "/100k"}{" "}
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("intentional")}
                >
                  <div className="flex items-center gap-1">
                    ⚔️ Intentional{" "}
                    {displayMode === "percentage" ? "%" : "/100k"}{" "}
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="p-3">Data Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {filteredAndSorted.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-bold text-muted-foreground">
                    #{c.rank}
                  </td>
                  <td className="p-3 font-sans">
                    <a
                      href={`/deathatlas/dashboard?country=${c.id}`}
                      className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <span
                        className="text-base leading-none"
                        role="img"
                        aria-label={`${c.name} Flag`}
                      >
                        {c.flag}
                      </span>
                      <span>{c.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground font-normal">
                        ({c.id})
                      </span>
                    </a>
                    <span className="text-[10px] text-muted-foreground block pl-6">
                      {c.continent}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-black text-sm text-primary">
                      {c.score}
                    </span>
                  </td>
                  <td className="p-3">{c.life_expectancy}y</td>
                  <td className="p-3">{c.crude_death_rate}</td>
                  <td className="p-3 font-bold">{c.rates_per_100k.total}</td>
                  <td className="p-3 text-muted-foreground">
                    {c.total_deaths.toLocaleString()}
                  </td>
                  <td className="p-3 text-sky-400 font-bold">
                    {displayMode === "percentage"
                      ? `${c.groups.natural.percentage}%`
                      : c.rates_per_100k.natural}
                  </td>
                  <td className="p-3 text-amber-400 font-bold">
                    {displayMode === "percentage"
                      ? `${c.groups.accidental.percentage}%`
                      : c.rates_per_100k.accidental}
                  </td>
                  <td className="p-3 text-rose-400 font-bold">
                    {displayMode === "percentage"
                      ? `${c.groups.intentional.percentage}%`
                      : c.rates_per_100k.intentional}
                  </td>
                  <td className="p-3 font-sans">
                    {c.data_confidence === "high" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                        <ShieldCheck className="size-3" /> High
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500"
                        title={c.confidence_note || "Model-based estimate"}
                      >
                        <AlertTriangle className="size-3" />{" "}
                        {c.data_confidence === "low" ? "Estimate" : "Medium"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
