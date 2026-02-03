import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { PRESETS, PresetKey } from "../lib/presets";

type WorkerMessage =
  | { type: "load" }
  | { type: "process"; file: File; preset: PresetKey; seed: number };

type WorkerResponse =
  | { type: "ready" }
  | { type: "progress"; value: number }
  | { type: "done"; url: string; filename: string }
  | { type: "error"; message: string };

const ffmpeg = new FFmpeg();
let loadingPromise: Promise<void> | null = null;

const loadFfmpeg = () => {
  if (loadingPromise) return loadingPromise;
  loadingPromise = ffmpeg.load({
    coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js",
    wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.wasm"
  });
  return loadingPromise;
};

const mulberry32 = (seed: number) => {
  let t = seed + 0x6d2b79f5;
  return () => {
    t += 0x6d2b79f5;
    let result = Math.imul(t ^ (t >>> 15), t | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

self.addEventListener("message", async (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  try {
    if (message.type === "load") {
      await loadFfmpeg();
      const response: WorkerResponse = { type: "ready" };
      self.postMessage(response);
      return;
    }

    if (message.type === "process") {
      await loadFfmpeg();
      const { file, preset, seed } = message;
      const settings = PRESETS[preset];
      const rand = mulberry32(seed);

      const inputName = "input";
      const outputName = "output.mp4";

      ffmpeg.on("progress", ({ progress }) => {
        const response: WorkerResponse = {
          type: "progress",
          value: Math.min(100, Math.max(0, progress * 100))
        };
        self.postMessage(response);
      });

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const crop = rand() * settings.cropMax;
      const zoom = rand() * settings.zoomMax;
      const shift = (rand() * 2 - 1) * settings.colorShift;
      const noise = settings.noise + rand() * 1.5;
      const shiftX = rand();
      const shiftY = rand();

      const filter = [
        `scale=iw*(1+${zoom}):ih*(1+${zoom}):flags=lanczos`,
        `crop=iw*(1-${crop}):ih*(1-${crop}):x=(iw-ow)*${shiftX}:y=(ih-oh)*${shiftY}`,
        `scale=iw/((1+${zoom})*(1-${crop})):ih/((1+${zoom})*(1-${crop})):flags=lanczos`,
        `colorchannelmixer=rr=1:rg=${shift}:rb=0:gr=${-shift}:gg=1:gb=0:br=0:bg=${shift}:bb=1`,
        `noise=alls=${noise}:allf=t+u`,
        "format=yuv420p"
      ].join(",");

      await ffmpeg.exec([
        "-i",
        inputName,
        "-vf",
        filter,
        "-c:v",
        "libx264",
        "-profile:v",
        "high",
        "-pix_fmt",
        "yuv420p",
        "-g",
        String(settings.gop),
        "-keyint_min",
        String(settings.gop),
        "-sc_threshold",
        "0",
        "-preset",
        "slow",
        "-crf",
        "18",
        "-c:a",
        "aac",
        "-b:a",
        settings.audioBitrate,
        "-ar",
        "48000",
        "-map_metadata",
        "-1",
        "-map_chapters",
        "-1",
        "-metadata",
        "creation_time=",
        "-metadata",
        "encoder=",
        "-metadata",
        "encoding_tool=",
        "-movflags",
        "+faststart",
        outputName
      ]);

      const data = (await ffmpeg.readFile(outputName)) as Uint8Array;
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      const response: WorkerResponse = {
        type: "done",
        url,
        filename: `unique-${file.name.replace(/\.(mp4|mov)$/i, "")}.mp4`
      };
      self.postMessage(response);
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    }
  } catch (error) {
    const response: WorkerResponse = {
      type: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    };
    self.postMessage(response);
  }
});

export {};
