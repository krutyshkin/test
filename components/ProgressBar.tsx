"use client";

type ProgressBarProps = {
  value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>Обработка</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
