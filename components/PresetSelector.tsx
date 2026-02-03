"use client";

import { PresetKey, PRESETS } from "../lib/presets";

type PresetSelectorProps = {
  value: PresetKey;
  onChange: (value: PresetKey) => void;
};

export default function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {Object.entries(PRESETS).map(([key, preset]) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key as PresetKey)}
            className={`card flex flex-col gap-2 p-4 text-left transition ${
              active
                ? "border-accent/60 ring-2 ring-accent/40"
                : "hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{preset.label}</span>
              {active && (
                <span className="rounded-full bg-accent px-2 py-1 text-[10px] uppercase">
                  selected
                </span>
              )}
            </div>
            <p className="text-sm text-white/60">{preset.description}</p>
          </button>
        );
      })}
    </div>
  );
}
