import React, { useState, useMemo } from "react";
import { countries } from "@/lib/data";
import type { CountryData } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Search,
  Download,
  ArrowUpDown,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

type SortField =
  | "rank"
  | "name"
  | "score"
  | "life_expectancy"
  | "crude_death_rate"
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

  const continents = [
    "All",
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
  ];
  const confidenceLevels = ["All", "high", "medium", "low"];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === "name" ? true : false); // Numbers descending by default
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
          valA = a.groups.natural.percentage;
          valB = b.groups.natural.percentage;
        } else if (sortField === "accidental") {
          valA = a.groups.accidental.percentage;
          valB = b.groups.accidental.percentage;
        } else if (sortField === "intentional") {
          valA = a.groups.intentional.percentage;
          valB = b.groups.intentional.percentage;
        }

        if (typeof valA === "string") {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [search, continent, confidence, sortField, sortAsc]);

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
      "Continent",
      "DeathAtlasScore",
      "LifeExpectancy",
      "CrudeDeathRate",
      "TotalDeaths",
      "NaturalPct",
      "AccidentalPct",
      "IntentionalPct",
      "DataConfidence",
    ];
    const rows = filteredAndSorted.map((c) => [
      c.rank,
      c.id,
      `"${c.name}"`,
      `"${c.continent}"`,
      c.score,
      c.life_expectancy,
      c.crude_death_rate,
      c.total_deaths,
      c.groups.natural.percentage,
      c.groups.accidental.percentage,
      c.groups.intentional.percentage,
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
            className="gap-2 font-semibold"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportJSON}
            className="gap-2 font-semibold"
          >
            <Download className="size-3.5" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by country or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>

        {/* Continent Filter */}
        <select
          value={continent}
          onChange={(e) => setContinent(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        >
          {continents.map((c) => (
            <option key={c} value={c}>
              Continent: {c}
            </option>
          ))}
        </select>

        {/* Confidence Filter */}
        <select
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        >
          {confidenceLevels.map((lvl) => (
            <option key={lvl} value={lvl}>
              Data Confidence: {lvl.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Count summary */}
      <div className="text-xs text-muted-foreground">
        Showing <strong>{filteredAndSorted.length}</strong> of{" "}
        {countries.length} countries
      </div>

      {/* Responsive Table */}
      <Card className="border-border/60 bg-card/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/70 text-muted-foreground font-mono text-[10px] uppercase tracking-wider select-none">
              <tr>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("rank")}
                >
                  <div className="flex items-center gap-1">
                    Rank <ArrowUpDown className="size-3" />
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
                    Death Rate <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("total_deaths")}
                >
                  <div className="flex items-center gap-1">
                    Deaths (2025) <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("natural")}
                >
                  <div className="flex items-center gap-1">
                    Natural % <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("accidental")}
                >
                  <div className="flex items-center gap-1">
                    Accidental % <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("intentional")}
                >
                  <div className="flex items-center gap-1">
                    Intentional % <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="p-3">Data Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAndSorted.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-muted-foreground">
                    #{c.rank}
                  </td>
                  <td className="p-3">
                    <a
                      href={`/deathatlas/dashboard?country=${c.id}`}
                      className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      {c.name}
                      <span className="text-[10px] font-mono text-muted-foreground font-normal">
                        ({c.id})
                      </span>
                    </a>
                    <span className="text-[10px] text-muted-foreground block">
                      {c.continent}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono font-black text-sm text-primary">
                      {c.score}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{c.life_expectancy}y</td>
                  <td className="p-3 font-mono">{c.crude_death_rate}</td>
                  <td className="p-3 font-mono">
                    {c.total_deaths.toLocaleString()}
                  </td>
                  <td className="p-3 font-mono text-sky-400">
                    {c.groups.natural.percentage}%
                  </td>
                  <td className="p-3 font-mono text-amber-400">
                    {c.groups.accidental.percentage}%
                  </td>
                  <td className="p-3 font-mono text-rose-400 font-semibold">
                    {c.groups.intentional.percentage}%
                  </td>
                  <td className="p-3">
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
