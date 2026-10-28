import React from "react";
import { KaTeXBlock, KaTeXInline } from "./KaTeX";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Scale,
  ExternalLink,
} from "lucide-react";
import { GithubIcon } from "./icons/GithubIcon";

export const MethodologyView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* Title */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider font-mono">
          <BookOpen className="size-3.5" />
          <span>Scientific & Algorithmic Foundation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
          Methodology & Scoring System
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Comprehensive documentation of the mathematical formulations, cause
          weightings, data synthesis protocols, and uncertainty disclosure
          standards powering Death Atlas 2025.
        </p>
      </div>

      {/* 1. Core Philosophy */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Scale className="size-5 text-primary" />
          <h2 className="text-xl font-bold font-mono text-foreground">
            1. Philosophical Premise
          </h2>
        </div>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-6 text-sm text-muted-foreground leading-relaxed flex flex-col gap-3">
            <p>
              Death is an inevitable biological culmination of human life.
              However,{" "}
              <strong className="text-foreground">
                the manner, timing, and preventability of death
              </strong>{" "}
              is a profound reflection of societal health, public safety,
              healthcare equity, and political stability.
            </p>
            <p>
              The central objective of the{" "}
              <strong className="text-foreground">
                Death Atlas Score ($S$)
              </strong>{" "}
              is to measure how closely a nation's mortality landscape
              approaches an ideal biological optimum—where individuals reach
              their maximum natural lifespan and pass peacefully from old age
              (senescence)—as opposed to having their lives violently or
              prematurely extinguished by armed conflicts, homicides, traffic
              crashes, or preventable infectious outbreaks.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 2. Mathematical Formulation */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-primary" />
          <h2 className="text-xl font-bold font-mono text-foreground">
            2. The Mathematical Formulation
          </h2>
        </div>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono">
              Primary Index Equation
            </CardTitle>
            <CardDescription className="text-xs">
              Continuous normalized linear combination of weighted mortality
              fractions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Let <KaTeXInline math="D_{\text{total}}" /> represent the total
              number of recorded and projected deaths in a country during the
              year 2025. The population mortality is partitioned into three
              disjoint sets:
            </p>

            <KaTeXBlock math="D_{\text{total}} = D_{\text{natural}} + D_{\text{accidental}} + D_{\text{intentional}} = \sum_{i \in C} D_i" />

            <p>
              where <KaTeXInline math="C" /> is the complete set of distinct
              cause classifications, and <KaTeXInline math="D_i" /> is the
              absolute count of deaths attributed to cause{" "}
              <KaTeXInline math="i" />.
            </p>

            <p>
              Each cause <KaTeXInline math="i \in C" /> is assigned an intrinsic
              quality-avoidability coefficient{" "}
              <KaTeXInline math="w_i \in [0.0, 1.0]" /> reflecting its degree of
              premature trauma and biological avoidability. The Death Atlas
              Score <KaTeXInline math="S \in [0.0, 100.0]" /> is defined as:
            </p>

            <KaTeXBlock math="S = 100 \times \sum_{i \in C} \left( w_i \cdot \frac{D_i}{D_{\text{total}}} \right)" />

            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-2 mt-2">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-primary">
                Boundary Condition Proofs:
              </h4>
              <div className="flex flex-col gap-2 text-xs">
                <div>
                  <strong>Ideal Biological Longevity:</strong> If 100% of deaths
                  occur from natural senescence / extreme old age (
                  <KaTeXInline math="w_{\text{senescence}} = 1.00" />
                  ), the score achieves its maximum:
                  <KaTeXBlock math="\lim_{D_{\text{senescence}} \to D_{\text{total}}} S = 100 \times (1.00 \times 1.0) = 100.0" />
                </div>
                <div>
                  <strong>Extreme Violent Catastrophe:</strong> If 100% of
                  deaths result from intentional slaughter, war operations, or
                  violent murder (
                  <KaTeXInline math="w_{\text{war}} = w_{\text{homicide}} = 0.00" />
                  ), the score drops to zero:
                  <KaTeXBlock math="\lim_{D_{\text{intentional}} \to D_{\text{total}}} S = 100 \times (0.00 \times 1.0) = 0.0" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. Weighting Matrix */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-mono text-foreground">
          3. Complete Cause-of-Death Weighting Matrix (
          <KaTeXInline math="w_i" />)
        </h2>

        <Card className="border-border/60 bg-card/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">
                    Weight (<KaTeXInline math="w_i" />)
                  </th>
                  <th className="p-3">
                    Epidemiological & Ethical Justification
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Old Age & Senescence
                  </td>
                  <td className="p-3 text-sky-400">Natural</td>
                  <td className="p-3 font-mono font-bold text-primary">1.00</td>
                  <td className="p-3 text-muted-foreground">
                    Optimal biological completion of human lifespan; absence of
                    premature fatal trauma.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Neurodegenerative (Alzheimer's)
                  </td>
                  <td className="p-3 text-sky-400">Natural</td>
                  <td className="p-3 font-mono font-bold text-primary">0.85</td>
                  <td className="p-3 text-muted-foreground">
                    Pathology occurring almost exclusively at extreme advanced
                    ages (80+); correlates with longevity.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Neoplasms (Cancers)
                  </td>
                  <td className="p-3 text-sky-400">Natural</td>
                  <td className="p-3 font-mono font-bold text-primary">0.70</td>
                  <td className="p-3 text-muted-foreground">
                    Cellular replication breakdown predominantly in
                    late-adulthood; partially treatable with modern oncology.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Cardiovascular Diseases
                  </td>
                  <td className="p-3 text-sky-400">Natural</td>
                  <td className="p-3 font-mono font-bold text-primary">0.65</td>
                  <td className="p-3 text-muted-foreground">
                    Circulatory wear-and-tear; highly prevalent globally,
                    partially manageable via preventive cardiology.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Other Non-Communicable
                  </td>
                  <td className="p-3 text-sky-400">Natural</td>
                  <td className="p-3 font-mono font-bold text-primary">0.60</td>
                  <td className="p-3 text-muted-foreground">
                    Endocrine, chronic kidney, autoimmune conditions manifesting
                    across middle and late adulthood.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Chronic Respiratory
                  </td>
                  <td className="p-3 text-sky-400">Natural</td>
                  <td className="p-3 font-mono font-bold text-primary">0.55</td>
                  <td className="p-3 text-muted-foreground">
                    COPD, asthma, and chronic bronchitis often driven by
                    environmental pollutants and occupational exposures.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Infectious, Maternal & Neonatal
                  </td>
                  <td className="p-3 text-amber-400">Natural</td>
                  <td className="p-3 font-mono font-bold text-primary">0.35</td>
                  <td className="p-3 text-muted-foreground">
                    Tuberculosis, malaria, diarrheal pathogens, infant/maternal
                    mortality; preventable with public hygiene and vaccines.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Natural Disasters
                  </td>
                  <td className="p-3 text-amber-400">Accidental</td>
                  <td className="p-3 font-mono font-bold text-primary">0.30</td>
                  <td className="p-3 text-muted-foreground">
                    Earthquakes, tropical storms, severe floods; external force
                    majeure, mitigable by early warning and infrastructure.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Occupational Hazards
                  </td>
                  <td className="p-3 text-amber-400">Accidental</td>
                  <td className="p-3 font-mono font-bold text-primary">0.20</td>
                  <td className="p-3 text-muted-foreground">
                    Fatal industrial and construction accidents; preventable
                    through workplace safety regulations.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Falls, Poisonings & Drownings
                  </td>
                  <td className="p-3 text-amber-400">Accidental</td>
                  <td className="p-3 font-mono font-bold text-primary">0.18</td>
                  <td className="p-3 text-muted-foreground">
                    Accidental overdoses, domestic mishaps, elderly falls;
                    premature loss of potential life years.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Road & Transport Crashes
                  </td>
                  <td className="p-3 text-amber-400">Accidental</td>
                  <td className="p-3 font-mono font-bold text-primary">0.15</td>
                  <td className="p-3 text-muted-foreground">
                    Vehicle collisions disproportionately killing youth (ages
                    15–29); highly preventable via road engineering.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Suicide & Self-Harm
                  </td>
                  <td className="p-3 text-rose-400">Intentional</td>
                  <td className="p-3 font-mono font-bold text-primary">0.06</td>
                  <td className="p-3 text-muted-foreground">
                    Premature self-inflicted fatality; indicators of severe
                    psychosocial distress and healthcare gaps.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Homicide & Violent Crime
                  </td>
                  <td className="p-3 text-rose-400">Intentional</td>
                  <td className="p-3 font-mono font-bold text-primary">0.02</td>
                  <td className="p-3 text-muted-foreground">
                    Interpersonal criminal lethal violence; severe failure of
                    human security and rule of law.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Armed Conflict & War
                  </td>
                  <td className="p-3 text-rose-400">Intentional</td>
                  <td className="p-3 font-mono font-bold text-primary">0.00</td>
                  <td className="p-3 text-muted-foreground">
                    State and insurgent warfare; total antithesis of longevity
                    and peaceful human survival.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-foreground">
                    Terrorism & Group Violence
                  </td>
                  <td className="p-3 text-rose-400">Intentional</td>
                  <td className="p-3 font-mono font-bold text-primary">0.00</td>
                  <td className="p-3 text-muted-foreground">
                    Deliberate mass casualty attacks targeting civilian
                    non-combatants.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 4. Data Sources and 2025 Synthesis Protocol */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-mono text-foreground">
          4. 2025 Data Synthesis & Projection Protocol
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit mb-1">
                Baseline Demographics
              </Badge>
              <CardTitle className="text-base font-bold">
                UN Population Division (WPP 2024/2025)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Provides sovereign national population headcounts, age-structure
              projections, crude death rates (CDR), and life expectancy at birth
              for all 195 UN-recognized states.
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit mb-1">
                Cause Proportions
              </Badge>
              <CardTitle className="text-base font-bold">
                WHO Global Health Estimates & IHME GBD
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Provides cause-specific proportional mortality curves standardized
              by Socio-Demographic Index (SDI) and historical civil registration
              reports.
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit mb-1">
                Conflict & Crisis Hotspots
              </Badge>
              <CardTitle className="text-base font-bold">
                ACLED, UN OCHA & Defense Analyses
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Synthesizes real-time and projected casualty reporting for active
              war theaters in 2025 (Ukraine, Sudan civil war, Gaza/Palestine
              crisis, Haiti gang violence, Myanmar conflict, and Syria).
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit mb-1">
                Data Storage
              </Badge>
              <CardTitle className="text-base font-bold">
                Unified JSON Repository
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              All 195 nations are gathered and rigorously classified within a
              single, versioned JSON document (
              <code className="text-foreground">deaths-2025.json</code>)
              adhering to MIT open-source availability.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Confidence Tiers & Transparency Banner Policy */}
      <section id="confidence-tiers" className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-mono text-foreground">
          5. CRVS Quality Tiers & Uncertainty Disclosures
        </h2>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-6 flex flex-col gap-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              Vital statistics completeness varies across jurisdictions. Death
              Atlas enforces explicit visual disclosure banners whenever a
              country relies on third-party estimates or model extrapolations:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <span className="font-bold text-emerald-400 block mb-1 flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> High Confidence
                </span>
                Civil Registration & Vital Statistics (CRVS) coverage &gt;90%
                with medical ICD-10/ICD-11 certification. (e.g., Japan, Western
                Europe, Canada, Australia).
              </div>

              <div className="p-3 rounded-lg border border-sky-500/20 bg-sky-500/5">
                <span className="font-bold text-sky-400 block mb-1 flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> Medium Confidence
                </span>
                CRVS coverage 50–89% or large-scale sample registration systems
                (SRS) and national census administrative linkage. (e.g., India,
                Brazil, Mexico, Turkey).
              </div>

              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                <span className="font-bold text-amber-400 block mb-1 flex items-center gap-1">
                  <AlertTriangle className="size-3.5" /> Low / Synthetic
                  Estimate
                </span>
                Active armed conflict, institutional breakdown, or CRVS coverage
                &lt;50%. Demographics derived from UN WPP models, WHO estimates,
                and humanitarian monitors.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 6. Open Source & BanguDevClub */}
      <section className="flex flex-col gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold font-mono text-foreground">
                Death Atlas Open Source Project
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                Death Atlas is created and maintained by{" "}
                <strong className="text-foreground">BanguDevClub</strong> under
                the permissive MIT license. Contributions, academic citations,
                and data refinements are warmly welcomed.
              </p>
            </div>
            <a
              href="https://github.com/BanguDevClub/deathatlas"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="gap-2 font-semibold shadow-md whitespace-nowrap"
              >
                <GithubIcon className="size-4" />
                View on GitHub
                <ExternalLink className="size-3.5 opacity-60" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
