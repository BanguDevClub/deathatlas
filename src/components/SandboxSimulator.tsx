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
import { metadata } from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KaTeXBlock, KaTeXInline } from "./KaTeX";
import {
  FlaskConical,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";

interface SimulationState {
  senescence: number; // 1.00
  neurodegenerative: number; // 0.85
  neoplasms: number; // 0.70
  cardiovascular: number; // 0.65
  respiratory: number; // 0.55
  infectious: number; // 0.35
  transport: number; // 0.15
  falls_other: number; // 0.18
  suicide: number; // 0.06
  homicide: number; // 0.02
  conflict_war: number; // 0.00
}

const BASELINE_STATE: SimulationState = {
  senescence: 5.2,
  neurodegenerative: 6.5,
  neoplasms: 22.0,
  cardiovascular: 32.5,
  respiratory: 7.8,
  infectious: 18.6,
  transport: 1.8,
  falls_other: 3.3,
  suicide: 1.1,
  homicide: 0.7,
  conflict_war: 0.5,
};

const WEIGHTS: Record<keyof SimulationState, number> = {
  senescence: 1.0,
  neurodegenerative: 0.85,
  neoplasms: 0.7,
  cardiovascular: 0.65,
  respiratory: 0.55,
  infectious: 0.35,
  transport: 0.15,
  falls_other: 0.18,
  suicide: 0.06,
  homicide: 0.02,
  conflict_war: 0.0,
};

export const SandboxSimulator: React.FC = () => {
  const [state, setState] = useState<SimulationState>(BASELINE_STATE);

  // Compute total percentages in current state
  const totalRaw = Object.values(state).reduce((a, b) => a + b, 0);

  // Normalized percentages so they always sum to 100%
  const normalizedPercentages = Object.entries(state).reduce(
    (acc, [key, val]) => {
      acc[key as keyof SimulationState] =
        totalRaw > 0 ? (val / totalRaw) * 100 : 0;
      return acc;
    },
    {} as Record<keyof SimulationState, number>
  );

  // Compute Death Atlas Score: sum( (pct / 100) * weight ) * 100
  const computedScore = Object.entries(normalizedPercentages).reduce(
    (acc, [key, pct]) => {
      const w = WEIGHTS[key as keyof SimulationState];
      return acc + (pct / 100) * w * 100;
    },
    0
  );

  const baselineScore = metadata.global_score;
  const scoreDelta = Number((computedScore - baselineScore).toFixed(1));

  // Handler for single slider change
  const handleChange = (key: keyof SimulationState, newVal: number) => {
    setState((prev) => ({
      ...prev,
      [key]: Math.max(0, newVal),
    }));
  };

  // Presets
  const applyPreset = (preset: string) => {
    if (preset === "utopia") {
      setState({
        senescence: 100,
        neurodegenerative: 0,
        neoplasms: 0,
        cardiovascular: 0,
        respiratory: 0,
        infectious: 0,
        transport: 0,
        falls_other: 0,
        suicide: 0,
        homicide: 0,
        conflict_war: 0,
      });
    } else if (preset === "dystopia") {
      setState({
        senescence: 0,
        neurodegenerative: 0,
        neoplasms: 0,
        cardiovascular: 0,
        respiratory: 0,
        infectious: 0,
        transport: 0,
        falls_other: 0,
        suicide: 0,
        homicide: 40,
        conflict_war: 60,
      });
    } else if (preset === "peace") {
      // Eliminate war & homicide, shift into senescence & longevity
      setState((prev) => ({
        ...prev,
        conflict_war: 0,
        homicide: 0,
        senescence: prev.senescence + prev.conflict_war + prev.homicide,
      }));
    } else if (preset === "cancer_breakthrough") {
      // 50% cancer reduction converted into healthy senescence
      setState((prev) => ({
        ...prev,
        neoplasms: prev.neoplasms * 0.5,
        senescence: prev.senescence + prev.neoplasms * 0.5,
      }));
    } else if (preset === "zero_transport") {
      setState((prev) => ({
        ...prev,
        transport: 0,
        senescence: prev.senescence + prev.transport,
      }));
    } else if (preset === "infectious_cure") {
      // Global eradication of malaria, tuberculosis, cholera, maternal death
      setState((prev) => ({
        ...prev,
        infectious: 1.0,
        senescence: prev.senescence + (prev.infectious - 1.0),
      }));
    } else if (preset === "reset") {
      setState(BASELINE_STATE);
    }
  };

  // Chart data comparing Baseline vs Simulation
  const chartData = [
    {
      cause: "Senescence",
      Baseline: BASELINE_STATE.senescence,
      Simulated: Number(normalizedPercentages.senescence.toFixed(1)),
    },
    {
      cause: "Cancer",
      Baseline: BASELINE_STATE.neoplasms,
      Simulated: Number(normalizedPercentages.neoplasms.toFixed(1)),
    },
    {
      cause: "Cardio",
      Baseline: BASELINE_STATE.cardiovascular,
      Simulated: Number(normalizedPercentages.cardiovascular.toFixed(1)),
    },
    {
      cause: "Infectious",
      Baseline: BASELINE_STATE.infectious,
      Simulated: Number(normalizedPercentages.infectious.toFixed(1)),
    },
    {
      cause: "Transport",
      Baseline: BASELINE_STATE.transport,
      Simulated: Number(normalizedPercentages.transport.toFixed(1)),
    },
    {
      cause: "Homicide",
      Baseline: BASELINE_STATE.homicide,
      Simulated: Number(normalizedPercentages.homicide.toFixed(1)),
    },
    {
      cause: "War",
      Baseline: BASELINE_STATE.conflict_war,
      Simulated: Number(normalizedPercentages.conflict_war.toFixed(1)),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider font-mono">
          <FlaskConical className="size-3.5" />
          <span>Interactive Counterfactual Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
          Mortality Sandbox Simulator
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Tweak global cause distributions to observe how biomedical
          breakthroughs, peace treaties, or catastrophic conflict alter the
          Death Atlas Score ($S$) in real time.
        </p>
      </div>

      {/* Preset Buttons Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase font-mono mr-1">
          Scenarios:
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset("utopia")}
          className="gap-1.5 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs font-semibold"
        >
          <Sparkles className="size-3.5" />
          100% Old Age (Score: 100)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset("peace")}
          className="gap-1.5 border-sky-500/40 text-sky-400 hover:bg-sky-500/10 text-xs font-semibold"
        >
          <ShieldCheck className="size-3.5" />
          Universal Peace
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset("cancer_breakthrough")}
          className="gap-1.5 border-purple-500/40 text-purple-400 hover:bg-purple-500/10 text-xs font-semibold"
        >
          Cure 50% Cancer
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset("infectious_cure")}
          className="gap-1.5 border-blue-500/40 text-blue-400 hover:bg-blue-500/10 text-xs font-semibold"
        >
          Eradicate Pathogens
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset("zero_transport")}
          className="gap-1.5 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs font-semibold"
        >
          Autonomous Zero-Crashes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset("dystopia")}
          className="gap-1.5 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold"
        >
          Total War (Score: 0)
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyPreset("reset")}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          Reset Baseline
        </Button>
      </div>

      {/* Main Score Feedback Gauge Card */}
      <Card className="border-primary/40 bg-card/80 backdrop-blur shadow-lg">
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground font-semibold">
              Simulated Death Atlas Score
            </span>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl sm:text-6xl font-black font-mono text-primary">
                {computedScore.toFixed(1)}
              </span>
              <span className="text-xl font-mono text-muted-foreground">
                / 100
              </span>

              {/* Delta badge */}
              {scoreDelta !== 0 && (
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                    scoreDelta > 0
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {scoreDelta > 0 ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseline Global 2025: <strong>{baselineScore}</strong> • Score
              shifts in response to cause weightings
            </p>
          </div>

          {/* Mathematical formulation status */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/30 max-w-sm text-xs flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-bold font-mono text-foreground">
              <Info className="size-3.5 text-primary" />
              <span>Boundary Check</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              If senescence = 100%, score = <strong>100.0</strong>. If
              intentional trauma (war + homicide + terror) = 100%, score ={" "}
              <strong>0.0</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sliders Grid & Live Recharts Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders Column */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono">
              Cause Proportion Controls
            </CardTitle>
            <CardDescription className="text-xs">
              Adjust relative weights; all factors dynamically renormalize to
              100% total mortality.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {/* Senescence */}
            <SliderRow
              label="Old Age & Senescence"
              weight={WEIGHTS.senescence}
              rawVal={state.senescence}
              pctVal={normalizedPercentages.senescence}
              onChange={(v) => handleChange("senescence", v)}
              color="sky"
            />

            {/* Neurodegenerative */}
            <SliderRow
              label="Neurodegenerative (Alzheimer's)"
              weight={WEIGHTS.neurodegenerative}
              rawVal={state.neurodegenerative}
              pctVal={normalizedPercentages.neurodegenerative}
              onChange={(v) => handleChange("neurodegenerative", v)}
              color="sky"
            />

            {/* Cancer */}
            <SliderRow
              label="Neoplasms (Cancers)"
              weight={WEIGHTS.neoplasms}
              rawVal={state.neoplasms}
              pctVal={normalizedPercentages.neoplasms}
              onChange={(v) => handleChange("neoplasms", v)}
              color="sky"
            />

            {/* Cardiovascular */}
            <SliderRow
              label="Cardiovascular Diseases"
              weight={WEIGHTS.cardiovascular}
              rawVal={state.cardiovascular}
              pctVal={normalizedPercentages.cardiovascular}
              onChange={(v) => handleChange("cardiovascular", v)}
              color="sky"
            />

            {/* Infectious */}
            <SliderRow
              label="Infectious & Communicable"
              weight={WEIGHTS.infectious}
              rawVal={state.infectious}
              pctVal={normalizedPercentages.infectious}
              onChange={(v) => handleChange("infectious", v)}
              color="amber"
            />

            {/* Transport */}
            <SliderRow
              label="Road & Transport Crashes"
              weight={WEIGHTS.transport}
              rawVal={state.transport}
              pctVal={normalizedPercentages.transport}
              onChange={(v) => handleChange("transport", v)}
              color="amber"
            />

            {/* Homicide */}
            <SliderRow
              label="Homicide & Violent Crime"
              weight={WEIGHTS.homicide}
              rawVal={state.homicide}
              pctVal={normalizedPercentages.homicide}
              onChange={(v) => handleChange("homicide", v)}
              color="rose"
            />

            {/* War */}
            <SliderRow
              label="Armed Conflict & War"
              weight={WEIGHTS.conflict_war}
              rawVal={state.conflict_war}
              pctVal={normalizedPercentages.conflict_war}
              onChange={(v) => handleChange("conflict_war", v)}
              color="rose"
            />

            {/* Suicide */}
            <SliderRow
              label="Suicide & Self-Harm"
              weight={WEIGHTS.suicide}
              rawVal={state.suicide}
              pctVal={normalizedPercentages.suicide}
              onChange={(v) => handleChange("suicide", v)}
              color="rose"
            />
          </CardContent>
        </Card>

        {/* Live Recharts Chart & KaTeX Math Breakdown */}
        <div className="flex flex-col gap-6">
          <Card className="border-border/60 bg-card/60">
            <CardHeader>
              <CardTitle className="text-base font-bold font-mono">
                Baseline vs Simulated Proportions (%)
              </CardTitle>
              <CardDescription className="text-xs">
                Visual delta between global 2025 reality and your experiment.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                >
                  <XAxis dataKey="cause" tick={{ fontSize: 10 }} />
                  <YAxis unit="%" tick={{ fontSize: 10 }} />
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
                    dataKey="Baseline"
                    fill="#64748b"
                    opacity={0.5}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Simulated"
                    fill="#38bdf8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Mathematical Evaluation Card */}
          <Card className="border-border/60 bg-card/60">
            <CardHeader>
              <CardTitle className="text-base font-bold font-mono">
                Mathematical Evaluation (KaTeX)
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time formula calculation for the current scenario.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <KaTeXBlock
                math={`S = 100 \\times \\sum_{i \\in C} \\left( w_i \\cdot \\frac{D_i}{D_{\\text{total}}} \\right) = ${computedScore.toFixed(1)}`}
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Notice that as you shift percentage share into{" "}
                <strong className="text-foreground">Senescence</strong> (
                <KaTeXInline math="w = 1.0" />
                ), the score approaches its mathematical supremum of{" "}
                <strong className="text-foreground">100.0</strong>. Conversely,
                allocating deaths into{" "}
                <strong className="text-foreground">Conflict & Homicide</strong>{" "}
                (<KaTeXInline math="w = 0.0" />) drags the score toward{" "}
                <strong className="text-foreground">0.0</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface SliderRowProps {
  label: string;
  weight: number;
  rawVal: number;
  pctVal: number;
  onChange: (val: number) => void;
  color: "sky" | "amber" | "rose";
}

const SliderRow: React.FC<SliderRowProps> = ({
  label,
  weight,
  rawVal,
  pctVal,
  onChange,
  color,
}) => {
  const dotColor =
    color === "sky"
      ? "bg-sky-400"
      : color === "amber"
        ? "bg-amber-400"
        : "bg-rose-400";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${dotColor}`} />
          <span className="font-semibold text-foreground">{label}</span>
          <span className="text-[10px] font-mono text-muted-foreground">
            (w: {weight.toFixed(2)})
          </span>
        </div>
        <span className="font-mono font-bold text-foreground">
          {pctVal.toFixed(1)}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={rawVal}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary h-1.5 rounded-lg bg-muted cursor-pointer"
      />
    </div>
  );
};
