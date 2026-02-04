import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Puzzle,
  SlidersHorizontal,
  Wrench,
  Check,
  Info,
  Layers,
  Cpu,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  Moon,
  Sun,
  Plus,
  Link2,
  Database,
  Plug,
  Boxes,
  Shield,
  Server,
  Brain,
} from "lucide-react";

/**
 * Interactive, website-like presentation for an enterprise data pipeline.
 * - Single-row puzzle pipeline
 * - Click a piece to open a pop-up (modal)
 * - Prebuilt: grouped toggle switches
 * - Configurable: presets + sliders + (optional) toggle options
 * - Custom: blueprint canvas + (optional) model chooser
 *
 * Note: Tech “logos” are lightweight monograms (preview-safe, no external assets).
 */

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TYPE_META = {
  prebuilt: {
    label: "Prebuilt",
    icon: Puzzle,
    badge: "bg-sky-100 text-sky-800 border-sky-200",
    piece: "bg-sky-50 border-sky-200",
  },
  configurable: {
    label: "Configurable",
    icon: SlidersHorizontal,
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    piece: "bg-emerald-50 border-emerald-200",
  },
  custom: {
    label: "Custom",
    icon: Wrench,
    badge: "bg-violet-100 text-violet-800 border-violet-200",
    piece: "bg-violet-50 border-violet-200",
  },
};

// Minimal “logo-like” marks (monograms) so the stack reads instantly without external assets.
const TECH_MARK = {
  Airbyte: "AB",
  Kafka: "K",
  S3: "S3",
  Snowflake: "SF",
  dbt: "dbt",
  Spark: "SP",
  Dagster: "DG",
  Docker: "DK",
  Kubernetes: "K8s",
  FastAPI: "FA",
  PyTorch: "PT",
  TensorFlow: "TF",
  Python: "Py",
  "Great Expectations": "GE",
  OpenLineage: "OL",
  SSO: "SSO",
  "Next.js": "N",
  React: "R",
  Postgres: "PG",
  Redis: "RD",
};

function TechMark({ name, dark }) {
  const mark = TECH_MARK[name] || name.slice(0, 2).toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-md border px-1 text-[10px] font-black",
        dark ? "border-gray-800 bg-gray-950 text-gray-100" : "border-gray-200 bg-white text-gray-900"
      )}
      aria-hidden="true"
      title={name}
    >
      {mark}
    </span>
  );
}

function TechChip({ name, dark }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold",
        dark ? "border-gray-800 bg-gray-950 text-gray-200" : "bg-white text-gray-700"
      )}
      title={name}
    >
      <TechMark name={name} dark={dark} />
      {name}
    </span>
  );
}

function Chip({ children, dark }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        dark ? "border-gray-800 bg-gray-950 text-gray-200" : "bg-white text-gray-700"
      )}
    >
      {children}
    </span>
  );
}

function Badge({ type }) {
  const meta = TYPE_META[type];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        meta.badge
      )}
    >
      <Icon className="h-4 w-4" />
      {meta.label}
    </span>
  );
}

function Meter({ label, value, dark }) {
  return (
    <div className="space-y-1">
      <div className={cn("flex items-center justify-between text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className={cn("h-2 w-full rounded-full border", dark ? "border-gray-800 bg-gray-950" : "bg-white")}>
        <div className={cn("h-full rounded-full", dark ? "bg-gray-200" : "bg-gray-900")} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SliderRow({ label, hint, value, onChange, dark }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className={cn("text-xs font-semibold", dark ? "text-gray-200" : "text-gray-700")}>{label}</div>
          <div className={cn("text-[11px] truncate", dark ? "text-gray-500" : "text-gray-500")}>{hint}</div>
        </div>
        <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>{value}</div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("w-full", dark ? "accent-white" : "accent-gray-900")}
      />
    </div>
  );
}

function Toggle({ checked, onChange, label, dark }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "group flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left",
        dark ? "border-gray-800 bg-gray-950 hover:bg-gray-900" : "bg-white hover:bg-gray-50",
        "active:scale-[0.99] transition"
      )}
      aria-pressed={checked}
    >
      <div className="min-w-0">
        <span className={cn("truncate text-sm font-medium", dark ? "text-gray-100" : "text-gray-900")}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("text-xs font-semibold", checked ? "text-emerald-500" : dark ? "text-gray-500" : "text-gray-400")}>
          {checked ? "ON" : "OFF"}
        </span>
        {checked ? (
          <ToggleRight className="h-6 w-6 text-emerald-500" />
        ) : (
          <ToggleLeft className={cn("h-6 w-6", dark ? "text-gray-600" : "text-gray-300")} />
        )}
      </div>
    </button>
  );
}

function SectionHeader({ icon: Icon, title, dark }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("rounded-xl border p-2", dark ? "border-gray-800 bg-gray-950" : "bg-white")}>
        <Icon className={cn("h-4 w-4", dark ? "text-gray-200" : "text-gray-700")} />
      </div>
      <div className={cn("text-sm font-semibold", dark ? "text-gray-100" : "text-gray-900")}>{title}</div>
    </div>
  );
}

function Modal({ open, onClose, title, children, dark }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={cn("fixed inset-0 z-40", dark ? "bg-black/70" : "bg-black/40")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className={cn("w-full max-w-5xl overflow-hidden rounded-3xl border shadow-xl", dark ? "border-gray-800 bg-gray-900" : "bg-white")}>
              <div className={cn("flex items-center justify-between border-b px-6 py-4", dark ? "border-gray-800" : "")}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Info className={cn("h-5 w-5", dark ? "text-gray-300" : "text-gray-500")} />
                    <h2 className={cn("truncate text-lg font-semibold", dark ? "text-gray-100" : "text-gray-900")}>{title}</h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={cn(
                    "rounded-xl border p-2 hover:opacity-90",
                    dark ? "border-gray-800 bg-gray-950 text-gray-200" : "bg-white text-gray-700"
                  )}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 py-5">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------- Seed data ----------
const PIPELINE_DATA = [
  {
    id: "ingestion",
    title: "Ingestion + Storage",
    oneLiner: "Bring data in from many sources and land it reliably.",
    type: "prebuilt",
    icon: Plug,
    sections: [
      {
        title: "Ingestion",
        icon: Plug,
        items: [
          { key: "excel", label: "Excel / CSV", enabled: true },
          { key: "apis", label: "APIs", enabled: true },
          { key: "ocr", label: "OCR (scans)", enabled: false },
          { key: "streaming", label: "Streaming", enabled: true },
          { key: "batch", label: "Batch", enabled: true },
          { key: "cdc", label: "CDC (DB changes)", enabled: false },
        ],
      },
      {
        title: "Storage",
        icon: Database,
        items: [
          { key: "lake", label: "Data Lake (S3/GCS)", enabled: true },
          { key: "warehouse", label: "Warehouse (Snowflake/BigQuery)", enabled: true },
          { key: "catalog", label: "Catalog / metadata", enabled: false },
          { key: "partitioning", label: "Partitioning", enabled: true },
          { key: "encryption", label: "Encryption at rest", enabled: true },
        ],
      },
    ],
    stack: ["Airbyte", "Kafka", "S3", "Snowflake"],
  },
  {
    id: "etl",
    title: "ETL / Transformation",
    oneLiner: "Clean, shape, and standardize data for downstream use.",
    type: "configurable",
    icon: Boxes,
    tuning: {
      preset: "Standard",
      presets: {
        Standard: { freshness: 60, transformDepth: 55, validation: 60, costControl: 60, changeHandling: 55 },
        Optimized: { freshness: 75, transformDepth: 60, validation: 70, costControl: 70, changeHandling: 65 },
        Advanced: { freshness: 85, transformDepth: 80, validation: 85, costControl: 55, changeHandling: 80 },
      },
      values: { freshness: 60, transformDepth: 55, validation: 60, costControl: 60, changeHandling: 55 },
      sliders: [
        { key: "freshness", label: "Freshness", hint: "How quickly data updates" },
        { key: "transformDepth", label: "Transform depth", hint: "How much shaping / modeling" },
        { key: "validation", label: "Validation", hint: "How strict the checks are" },
        { key: "changeHandling", label: "Schema change handling", hint: "How well drift is handled" },
        { key: "costControl", label: "Cost control", hint: "How much we optimize spend" },
      ],
    },
    options: [
      {
        title: "Execution",
        icon: Server,
        items: [
          { key: "incremental", label: "Incremental runs", enabled: true },
          { key: "caching", label: "Caching", enabled: true },
          { key: "backfills", label: "Backfills", enabled: false },
          { key: "dedupe", label: "Deduplication", enabled: true },
        ],
      },
      {
        title: "Data quality",
        icon: Shield,
        items: [
          { key: "contracts", label: "Data contracts", enabled: true },
          { key: "lineage", label: "Lineage capture", enabled: true },
          { key: "tests", label: "Automated tests", enabled: true },
        ],
      },
    ],
    keywords: ["Reusable models", "Business rules", "Quality checks", "Lineage hooks"],
    stack: ["dbt", "Spark", "Dagster"],
  },
  {
    id: "ml",
    title: "ML Modeling / Analytics",
    oneLiner: "Choose a model approach, build features, train, and evaluate.",
    type: "custom",
    icon: Brain,
    model: {
      selected: "Gradient Boosted Trees",
      options: ["Gradient Boosted Trees", "Random Forest", "Neural Network", "Transformer"],
    },
    blueprint: {
      nodes: [
        { id: "features", label: "Feature set" },
        { id: "train", label: "Training" },
        { id: "eval", label: "Evaluation" },
      ],
      edges: [
        { from: "features", to: "train" },
        { from: "train", to: "eval" },
      ],
    },
    palette: [
      { kind: "feature", label: "Feature store" },
      { kind: "experiment", label: "Experiment tracking" },
      { kind: "monitor", label: "Model monitoring" },
      { kind: "guard", label: "Guardrails" },
    ],
    stack: ["PyTorch", "TensorFlow", "Python"],
  },
  {
    id: "serving",
    title: "Deployment + Serving",
    oneLiner: "Ship models and data services into production reliably.",
    type: "configurable",
    icon: Server,
    tuning: {
      preset: "Balanced",
      presets: {
        Balanced: { rolloutSafety: 70, latency: 60, throughput: 65, monitoring: 70, security: 70 },
        LowLatency: { rolloutSafety: 60, latency: 85, throughput: 70, monitoring: 65, security: 70 },
        HighAssurance: { rolloutSafety: 85, latency: 55, throughput: 60, monitoring: 85, security: 85 },
      },
      values: { rolloutSafety: 70, latency: 60, throughput: 65, monitoring: 70, security: 70 },
      sliders: [
        { key: "rolloutSafety", label: "Rollout safety", hint: "Canary, rollback" },
        { key: "latency", label: "Latency target", hint: "How fast responses must be" },
        { key: "throughput", label: "Throughput", hint: "How many requests" },
        { key: "monitoring", label: "Monitoring depth", hint: "Logs, traces, alerts" },
        { key: "security", label: "Security", hint: "Auth, rate limits" },
      ],
    },
    options: [
      {
        title: "Runtime",
        icon: Server,
        items: [
          { key: "autoscale", label: "Autoscaling", enabled: true },
          { key: "canary", label: "Canary deploy", enabled: true },
          { key: "rollback", label: "Auto rollback", enabled: true },
        ],
      },
      {
        title: "Access",
        icon: Shield,
        items: [
          { key: "auth", label: "Auth (JWT/OAuth)", enabled: true },
          { key: "ratelimit", label: "Rate limiting", enabled: true },
          { key: "mTLS", label: "mTLS", enabled: false },
        ],
      },
    ],
    keywords: ["REST", "gRPC", "Canary deploy", "Autoscale", "Alerts"],
    stack: ["Docker", "Kubernetes", "FastAPI"],
  },
  {
    id: "gov",
    title: "Governance",
    oneLiner: "Policies, access, audit trails, and safety for enterprise use.",
    type: "custom",
    icon: Shield,
    blueprint: {
      nodes: [
        { id: "access", label: "Access" },
        { id: "pii", label: "PII rules" },
        { id: "audit", label: "Audit trail" },
      ],
      edges: [
        { from: "access", to: "pii" },
        { from: "pii", to: "audit" },
      ],
    },
    palette: [
      { kind: "policy", label: "Policies" },
      { kind: "contracts", label: "Data contracts" },
      { kind: "lineage", label: "Lineage" },
      { kind: "mask", label: "Masking" },
    ],
    stack: ["Great Expectations", "OpenLineage", "SSO"],
  },
  {
    id: "vertical",
    title: "Vertical SaaS (White-label)",
    oneLiner: "A white-labeled customer interface built on top of the pipeline.",
    type: "prebuilt",
    icon: Boxes,
    sections: [
      {
        title: "Interface",
        icon: Boxes,
        items: [
          { key: "branding", label: "Custom branding", enabled: true },
          { key: "dashboards", label: "Prebuilt dashboards", enabled: true },
          { key: "workflows", label: "Standard workflows", enabled: true },
          { key: "alerts", label: "Alerts & notifications", enabled: true },
        ],
      },
      {
        title: "Enterprise",
        icon: Server,
        items: [
          { key: "sso", label: "SSO", enabled: true },
          { key: "rbac", label: "Role-based access", enabled: true },
          { key: "audit", label: "Audit logs", enabled: true },
          { key: "billing", label: "Usage metering", enabled: false },
        ],
      },
    ],
    stack: ["Next.js", "React", "Postgres", "Redis"],
  },
];

// ---------- Pieces + panels ----------
function PuzzlePiece({ node, active, onClick, dark }) {
  const meta = TYPE_META[node.type];
  const Icon = node.icon || meta.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-[250px] shrink-0 rounded-2xl border p-4 text-left shadow-sm transition",
        dark ? "border-gray-800 bg-gray-950 hover:bg-gray-900" : meta.piece,
        active ? "ring-2 ring-white/10" : "hover:shadow-md"
      )}
    >
      <div className={cn("absolute -top-3 left-1/2 h-6 w-14 -translate-x-1/2 rounded-full border", dark ? "border-gray-800 bg-gray-950" : "bg-white/70")} />
      <div className={cn("absolute right-[-12px] top-1/2 h-10 w-6 -translate-y-1/2 rounded-full border", dark ? "border-gray-800 bg-gray-950" : "bg-white/70")} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={cn("truncate text-base font-semibold", dark ? "text-gray-100" : "text-gray-900")}>{node.title}</h3>
          <p className={cn("mt-1 line-clamp-2 text-sm", dark ? "text-gray-400" : "text-gray-600")}>{node.oneLiner}</p>
        </div>
        <div className={cn("mt-0.5 rounded-xl border p-2", dark ? "border-gray-800 bg-gray-900 text-gray-100" : "text-gray-700")}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Badge type={node.type} />
        <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", dark ? "text-gray-300" : "text-gray-700")}>
          Open <ArrowRight className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {node.stack.slice(0, 3).map((s) => (
          <TechChip key={s} name={s} dark={dark} />
        ))}
        {node.stack.length > 3 && <Chip dark={dark}>+{node.stack.length - 3}</Chip>}
      </div>
    </button>
  );
}

function PrebuiltPanel({ node, setNodes, dark }) {
  function toggle(sectionTitle, key) {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== node.id) return n;
        const sections = (n.sections || []).map((s) =>
          s.title !== sectionTitle
            ? s
            : {
                ...s,
                items: s.items.map((it) => (it.key === key ? { ...it, enabled: !it.enabled } : it)),
              }
        );
        return { ...n, sections };
      })
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-5">
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <Badge type={node.type} />
          <span className={cn("inline-flex items-center gap-2 text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>
            <Check className="h-4 w-4" />
            Plug-and-play
          </span>
        </div>

        <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
          <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Work + flexibility</div>
          <div className="mt-3 space-y-3">
            <Meter label="Effort" value={20} dark={dark} />
            <Meter label="Flexibility" value={35} dark={dark} />
          </div>
        </div>

        <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
          <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Tech stack</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {node.stack.map((s) => (
              <TechChip key={s} name={s} dark={dark} />
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-3 space-y-4">
        {(node.sections || []).map((sec) => (
          <div key={sec.title} className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
            <SectionHeader icon={sec.icon} title={sec.title} dark={dark} />
            <div className="mt-3 space-y-2">
              {sec.items.map((it) => (
                <Toggle
                  key={it.key}
                  label={it.label}
                  checked={it.enabled}
                  onChange={() => toggle(sec.title, it.key)}
                  dark={dark}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigurablePanel({ node, setNodes, dark }) {
  const t = node.tuning;

  function setPreset(preset) {
    const next = t.presets[preset];
    setNodes((prev) =>
      prev.map((n) =>
        n.id !== node.id
          ? n
          : {
              ...n,
              tuning: {
                ...n.tuning,
                preset,
                values: { ...next },
              },
            }
      )
    );
  }

  function setValue(key, value) {
    setNodes((prev) =>
      prev.map((n) =>
        n.id !== node.id
          ? n
          : {
              ...n,
              tuning: {
                ...n.tuning,
                values: { ...n.tuning.values, [key]: value },
              },
            }
      )
    );
  }

  function toggleOption(sectionTitle, key) {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== node.id) return n;
        const options = (n.options || []).map((s) =>
          s.title !== sectionTitle
            ? s
            : {
                ...s,
                items: s.items.map((it) => (it.key === key ? { ...it, enabled: !it.enabled } : it)),
              }
        );
        return { ...n, options };
      })
    );
  }

  const values = t.values || {};

  // Storytelling meters (not "scientific" — just a consistent signal)
  const effort = Math.round(
    (values.validation ?? 60) * 0.35 + (values.transformDepth ?? 60) * 0.35 + (values.security ?? 60) * 0.15 + (values.rolloutSafety ?? 60) * 0.15
  );
  const flexibility = Math.round(
    (values.changeHandling ?? values.integrations ?? 60) * 0.55 + (values.monitoring ?? values.workflows ?? 60) * 0.45
  );

  return (
    <div className="grid gap-5 md:grid-cols-5">
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <Badge type={node.type} />
          <span className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Tunable controls</span>
        </div>

        <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
          <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Presets</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.keys(t.presets || {}).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold",
                  dark ? "border-gray-800 bg-gray-900 text-gray-100 hover:bg-gray-800" : "bg-white text-gray-700 hover:bg-gray-50",
                  t.preset === p && "ring-2 ring-white/10"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
          <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Work + flexibility</div>
          <div className="mt-3 space-y-3">
            <Meter label="Effort" value={Math.max(10, Math.min(95, effort))} dark={dark} />
            <Meter label="Flexibility" value={Math.max(10, Math.min(95, flexibility))} dark={dark} />
          </div>
        </div>

        <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
          <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Tech stack</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {node.stack.map((s) => (
              <TechChip key={s} name={s} dark={dark} />
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-3 space-y-4">
        <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
          <div className={cn("flex items-center gap-2 text-sm font-semibold", dark ? "text-gray-100" : "text-gray-800")}>
            <SlidersHorizontal className={cn("h-4 w-4", dark ? "text-gray-300" : "text-gray-500")} />
            Controls
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(t.sliders || []).map((s) => (
              <SliderRow
                key={s.key}
                label={s.label}
                hint={s.hint}
                value={t.values?.[s.key] ?? 50}
                onChange={(v) => setValue(s.key, v)}
                dark={dark}
              />
            ))}
          </div>
        </div>

        {!!(node.options && node.options.length) && (
          <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
            <div className={cn("flex items-center gap-2 text-sm font-semibold", dark ? "text-gray-100" : "text-gray-800")}>
              <Check className={cn("h-4 w-4", dark ? "text-gray-300" : "text-gray-500")} />
              Options
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {node.options.map((sec) => (
                <div key={sec.title} className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-900" : "bg-white")}>
                  <SectionHeader icon={sec.icon} title={sec.title} dark={dark} />
                  <div className="mt-3 space-y-2">
                    {sec.items.map((it) => (
                      <Toggle
                        key={it.key}
                        label={it.label}
                        checked={it.enabled}
                        onChange={() => toggleOption(sec.title, it.key)}
                        dark={dark}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
          <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Keywords</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(node.keywords || []).map((k) => (
              <Chip key={k} dark={dark}>
                {k}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelChooser({ node, setNodes, dark }) {
  const selected = node.model?.selected;
  const options = node.model?.options || [];

  function choose(opt) {
    setNodes((prev) => prev.map((n) => (n.id !== node.id ? n : { ...n, model: { ...n.model, selected: opt } })));
  }

  return (
    <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-2 text-sm font-semibold", dark ? "text-gray-100" : "text-gray-800")}>
          <Brain className={cn("h-4 w-4", dark ? "text-gray-300" : "text-gray-500")} />
          Model choice
        </div>
        <div className={cn("text-xs font-semibold", dark ? "text-gray-400" : "text-gray-500")}>{selected}</div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => choose(opt)}
            className={cn(
              "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
              dark ? "border-gray-800 bg-gray-900 text-gray-100 hover:bg-gray-800" : "bg-white text-gray-800 hover:bg-gray-50",
              selected === opt && "ring-2 ring-white/10"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function BlueprintCanvas({ node, setNodes, dark }) {
  const bp = node.blueprint || { nodes: [], edges: [] };
  const palette = node.palette || [];

  function addBlock(kind, label) {
    const id = `${kind}-${Math.random().toString(16).slice(2, 6)}`;
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== node.id) return n;
        const nodes2 = [...(n.blueprint?.nodes || []), { id, label }];
        const edges2 = [...(n.blueprint?.edges || [])];
        if (nodes2.length >= 2) edges2.push({ from: nodes2[nodes2.length - 2].id, to: id });
        return { ...n, blueprint: { nodes: nodes2, edges: edges2 } };
      })
    );
  }

  const effort = 90;
  const flex = 90;

  // Layout nodes in a row (prototype)
  const layout = (bp.nodes || []).map((n, i) => ({ ...n, x: 60 + i * 160, y: 80 }));
  const byId = Object.fromEntries(layout.map((n) => [n.id, n]));

  const HeaderIcon = node.icon || Wrench;

  return (
    <div className="grid gap-5 md:grid-cols-5">
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <Badge type={node.type} />
          <span className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Blueprint mode</span>
        </div>

        <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
          <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Work + flexibility</div>
          <div className="mt-3 space-y-3">
            <Meter label="Effort" value={effort} dark={dark} />
            <Meter label="Flexibility" value={flex} dark={dark} />
          </div>
        </div>

        {node.model && <ModelChooser node={node} setNodes={setNodes} dark={dark} />}

        {!!palette.length && (
          <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
            <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Add blocks</div>
            <div className="mt-2 grid gap-2">
              {palette.map((p) => (
                <button
                  key={p.kind}
                  onClick={() => addBlock(p.kind, p.label)}
                  className={cn(
                    "inline-flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold",
                    dark ? "border-gray-800 bg-gray-900 text-gray-100 hover:bg-gray-800" : "bg-white text-gray-800 hover:bg-gray-50"
                  )}
                >
                  {p.label} <Plus className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
          <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Tech stack</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {node.stack.map((s) => (
              <TechChip key={s} name={s} dark={dark} />
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-3">
        <div className={cn("rounded-2xl border p-4", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
          <div className={cn("flex items-center justify-between", dark ? "text-gray-100" : "text-gray-800")}>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <HeaderIcon className={cn("h-4 w-4", dark ? "text-gray-300" : "text-gray-500")} />
              Blueprint canvas
            </div>
            <span className={cn("text-xs font-semibold", dark ? "text-gray-400" : "text-gray-500")}>
              Dependencies grow as you add blocks
            </span>
          </div>

          <div className={cn("mt-4 overflow-hidden rounded-2xl border", dark ? "border-gray-800 bg-gray-900" : "bg-white")}>
            <svg viewBox="0 0 900 220" className="h-[240px] w-full">
              {(bp.edges || []).map((e, idx) => {
                const a = byId[e.from];
                const b = byId[e.to];
                if (!a || !b) return null;
                return (
                  <g key={idx}>
                    <line
                      x1={a.x + 120}
                      y1={a.y + 26}
                      x2={b.x}
                      y2={b.y + 26}
                      stroke={dark ? "#9CA3AF" : "#111827"}
                      strokeWidth="2"
                      opacity="0.5"
                    />
                    <circle cx={b.x} cy={b.y + 26} r="4" fill={dark ? "#E5E7EB" : "#111827"} opacity="0.6" />
                  </g>
                );
              })}

              {layout.map((n) => (
                <g key={n.id}>
                  <rect
                    x={n.x}
                    y={n.y}
                    rx="16"
                    ry="16"
                    width="120"
                    height="52"
                    fill={dark ? "#030712" : "#FFFFFF"}
                    stroke={dark ? "#1F2937" : "#E5E7EB"}
                  />
                  <text
                    x={n.x + 60}
                    y={n.y + 32}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="600"
                    fill={dark ? "#E5E7EB" : "#111827"}
                  >
                    {n.label}
                  </text>
                </g>
              ))}

              <line x1="30" y1="180" x2="870" y2="180" stroke={dark ? "#374151" : "#E5E7EB"} strokeWidth="2" opacity="0.35" />
            </svg>
          </div>

          <div className="mt-4">
            <div className={cn("text-xs font-semibold", dark ? "text-gray-300" : "text-gray-600")}>Keywords</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(bp.nodes || []).slice(0, 12).map((n) => (
                <Chip key={n.id} dark={dark}>
                  {n.label}
                </Chip>
              ))}
              {(bp.nodes || []).length > 12 && <Chip dark={dark}>+{(bp.nodes || []).length - 12}</Chip>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InteractivePuzzlePipelinePresentation() {
  const [dark, setDark] = useState(true);
  const [nodes, setNodes] = useState(() => PIPELINE_DATA);
  const [activeId, setActiveId] = useState(nodes[0]?.id ?? null);

  const active = useMemo(() => nodes.find((n) => n.id === activeId) || null, [nodes, activeId]);

  return (
    <div className={cn("min-h-screen transition-colors", dark ? "bg-gray-950 text-gray-100" : "bg-gradient-to-b from-gray-50 to-white")}>
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={cn("inline-flex items-center gap-2 text-sm font-semibold", dark ? "text-gray-300" : "text-gray-600")}>
              <Layers className="h-4 w-4" />
              Townhall Keynote • Interactive Overview
            </div>
            <h1 className={cn("mt-3 text-3xl font-semibold tracking-tight md:text-4xl", dark ? "text-gray-100" : "text-gray-900")}>
              Our Modular Data Pipeline
            </h1>
            <p className={cn("mt-2 max-w-2xl text-base", dark ? "text-gray-400" : "text-gray-600")}>
              Click any puzzle piece to explore how it’s built.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark((d) => !d)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold",
                dark ? "border-gray-800 bg-gray-900 text-gray-100 hover:bg-gray-800" : "bg-white text-gray-800 hover:bg-gray-50"
              )}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {dark ? "Light" : "Dark"}
            </button>

            <div className={cn("hidden rounded-2xl border px-4 py-3 shadow-sm md:block", dark ? "border-gray-800 bg-gray-900" : "bg-white")}>
              <div className={cn("flex items-center gap-2 text-sm font-semibold", dark ? "text-gray-100" : "text-gray-800")}>
                <Cpu className={cn("h-4 w-4", dark ? "text-gray-300" : "text-gray-500")} />
                Piece types
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", TYPE_META.prebuilt.badge)}>Prebuilt</span>
                <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", TYPE_META.configurable.badge)}>Configurable</span>
                <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", TYPE_META.custom.badge)}>Custom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-6">
        <div className={cn("rounded-3xl border p-4 shadow-sm", dark ? "border-gray-800 bg-gray-900" : "bg-white")}>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {nodes.map((n, idx) => (
              <div key={n.id} className="flex items-center gap-3">
                <PuzzlePiece node={n} active={n.id === activeId} onClick={() => setActiveId(n.id)} dark={dark} />
                {idx < nodes.length - 1 && (
                  <div className={cn("shrink-0", dark ? "text-gray-700" : "text-gray-300")}>
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={cn("mt-2 px-1 text-xs", dark ? "text-gray-500" : "text-gray-500")}>
            Tip: This row scrolls horizontally on smaller screens.
          </div>
        </div>
      </div>

      <Modal open={Boolean(active)} onClose={() => setActiveId(null)} title={active ? active.title : ""} dark={dark}>
        {active && (
          <div className="space-y-4">
            <p className={cn("text-sm", dark ? "text-gray-300" : "text-gray-700")}>{active.oneLiner}</p>
            {active.type === "prebuilt" && <PrebuiltPanel node={active} setNodes={setNodes} dark={dark} />}
            {active.type === "configurable" && <ConfigurablePanel node={active} setNodes={setNodes} dark={dark} />}
            {active.type === "custom" && <BlueprintCanvas node={active} setNodes={setNodes} dark={dark} />}
          </div>
        )}
      </Modal>

      <div className="mx-auto max-w-6xl px-6 pb-12 pt-10">
        <div className={cn("rounded-3xl border p-5 text-sm shadow-sm", dark ? "border-gray-800 bg-gray-900 text-gray-300" : "bg-white text-gray-600")}>
          <div className="flex items-start gap-3">
            <div className={cn("rounded-2xl border p-2", dark ? "border-gray-800 bg-gray-950" : "bg-gray-50")}>
              <Info className={cn("h-5 w-5", dark ? "text-gray-300" : "text-gray-600")} />
            </div>
            <div>
              <div className={cn("font-semibold", dark ? "text-gray-100" : "text-gray-800")}>Presenter flow</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Start with the pipeline row (big picture).</li>
                <li>Open a piece and show how the interaction matches the work involved.</li>
                <li>Prebuilt: grouped toggles • Configurable: presets + sliders + options • Custom: blueprint canvas.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

