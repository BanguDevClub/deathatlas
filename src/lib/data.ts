import data from "../data/deaths-2025.json";

export interface CauseBreakdownItem {
  total: number;
  percentage: number;
}

export interface NaturalBreakdown {
  senescence: CauseBreakdownItem;
  cardiovascular: CauseBreakdownItem;
  neoplasms: CauseBreakdownItem;
  respiratory: CauseBreakdownItem;
  neurodegenerative: CauseBreakdownItem;
  infectious_maternal: CauseBreakdownItem;
  other_natural: CauseBreakdownItem;
}

export interface AccidentalBreakdown {
  transport: CauseBreakdownItem;
  occupational: CauseBreakdownItem;
  natural_disasters: CauseBreakdownItem;
  falls_drowning_poisoning: CauseBreakdownItem;
  other_accidental: CauseBreakdownItem;
}

export interface IntentionalBreakdown {
  homicide: CauseBreakdownItem;
  suicide: CauseBreakdownItem;
  conflict_war: CauseBreakdownItem;
  terrorism: CauseBreakdownItem;
}

export interface CountryData {
  id: string;
  name: string;
  continent: string;
  region: string;
  population: number;
  total_deaths: number;
  crude_death_rate: number;
  life_expectancy: number;
  score: number;
  rank: number;
  data_confidence: "high" | "medium" | "low";
  confidence_note: string | null;
  groups: {
    natural: {
      total: number;
      percentage: number;
      breakdown: NaturalBreakdown;
    };
    accidental: {
      total: number;
      percentage: number;
      breakdown: AccidentalBreakdown;
    };
    intentional: {
      total: number;
      percentage: number;
      breakdown: IntentionalBreakdown;
    };
  };
}

export interface DatasetMetadata {
  title: string;
  year: number;
  project: string;
  organization: string;
  repository: string;
  license: string;
  total_countries: number;
  global_population: number;
  global_deaths: number;
  global_crude_death_rate: number;
  global_score: number;
  groups_summary: {
    natural: CauseBreakdownItem;
    accidental: CauseBreakdownItem;
    intentional: CauseBreakdownItem;
  };
  confidence_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  scoring_weights: Record<string, number>;
}

export const dataset = data as {
  metadata: DatasetMetadata;
  countries: CountryData[];
};

export const metadata = dataset.metadata;
export const countries = dataset.countries;

export function getCountryById(id: string): CountryData | undefined {
  return countries.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function getCountriesByContinent(continent: string): CountryData[] {
  return countries.filter(
    (c) => c.continent.toLowerCase() === continent.toLowerCase()
  );
}

export function getContinents(): string[] {
  return Array.from(new Set(countries.map((c) => c.continent))).sort();
}
