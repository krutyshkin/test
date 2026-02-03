export type PresetKey = "safe" | "balanced" | "aggressive";

export const PRESETS: Record<
  PresetKey,
  {
    label: string;
    description: string;
    cropMax: number;
    zoomMax: number;
    colorShift: number;
    noise: number;
    audioBitrate: string;
    gop: number;
  }
> = {
  safe: {
    label: "Safe",
    description: "100% незаметно",
    cropMax: 0.003,
    zoomMax: 0.002,
    colorShift: 0.01,
    noise: 2,
    audioBitrate: "128k",
    gop: 120
  },
  balanced: {
    label: "Balanced",
    description: "Оптимальный вариант",
    cropMax: 0.006,
    zoomMax: 0.004,
    colorShift: 0.02,
    noise: 4,
    audioBitrate: "160k",
    gop: 90
  },
  aggressive: {
    label: "Aggressive",
    description: "Максимальная уникальность",
    cropMax: 0.01,
    zoomMax: 0.006,
    colorShift: 0.03,
    noise: 6,
    audioBitrate: "192k",
    gop: 60
  }
};
