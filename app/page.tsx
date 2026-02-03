"use client";

import { useEffect, useRef, useState } from "react";
import UploadZone from "../components/UploadZone";
import ProgressBar from "../components/ProgressBar";
import PresetSelector from "../components/PresetSelector";
import { PresetKey } from "../lib/presets";

type WorkerMessage =
  | { type: "load" }
  | { type: "process"; file: File; preset: PresetKey; seed: number };

type WorkerResponse =
  | { type: "ready" }
  | { type: "progress"; value: number }
  | { type: "done"; url: string; filename: string }
  | { type: "error"; message: string };

export default function HomePage() {
  const workerRef = useRef<Worker | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<PresetKey>("balanced");
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const worker = new Worker(new URL("../workers/ffmpeg-worker.ts", import.meta.url));
    workerRef.current = worker;

    worker.postMessage({ type: "load" } satisfies WorkerMessage);

    worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
      const data = event.data;
      if (data.type === "progress") {
        setProgress(data.value);
      }
      if (data.type === "done") {
        setProcessing(false);
        setDownloadUrl(data.url);
        setDownloadName(data.filename);
      }
      if (data.type === "error") {
        setProcessing(false);
        setError(data.message);
      }
    });

    const handler = (event: any) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      worker.terminate();
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useEffect(() => {
    if (file) {
      setDownloadUrl(null);
      setDownloadName(null);
      setProgress(0);
      setError(null);
    }
  }, [file]);

  const handleProcess = () => {
    if (!file || !workerRef.current) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    const seed = Math.floor(Math.random() * 2 ** 32);
    workerRef.current.postMessage({
      type: "process",
      file,
      preset,
      seed
    } satisfies WorkerMessage);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <main className="min-h-screen bg-ink px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs uppercase tracking-[0.35em] text-white/60">
              Unique 9:16 Studio
            </div>
            {installPrompt && (
              <button
                onClick={handleInstall}
                className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white hover:bg-white/20"
              >
                Добавить на рабочий стол
              </button>
            )}
          </div>
          <h1 className="text-3xl font-semibold md:text-5xl">
            Уникализируйте вертикальные видео без потери качества
          </h1>
          <p className="max-w-2xl text-base text-white/70 md:text-lg">
            Без серверов. Без метаданных. Только браузер, Web Workers и
            оптимизированный FFmpeg для TikTok / Reels / Shorts.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <UploadZone file={file} onFileSelect={setFile} />
            <div className="card flex flex-col gap-4 p-6">
              <div className="text-sm uppercase tracking-[0.3em] text-white/60">
                Пресет уникализации
              </div>
              <PresetSelector value={preset} onChange={setPreset} />
            </div>
          </div>

          <div className="card flex flex-col gap-6 p-6">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-white/60">
                Что будет сделано
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>• Удаление EXIF / encoder / timestamps</li>
                <li>• Micro-crop и sub-pixel reposition</li>
                <li>• Dynamic micro-zoom и легкий color shift</li>
                <li>• Минимальный grain / dithering</li>
                <li>• GOP restructuring, audio re-encode, remux</li>
              </ul>
            </div>

            {processing ? (
              <ProgressBar value={progress} />
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleProcess}
                  disabled={!file}
                  className="rounded-xl bg-accent px-6 py-3 text-base font-semibold text-white transition hover:bg-accentSoft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Запустить уникализацию
                </button>
                {downloadUrl && downloadName && (
                  <a
                    href={downloadUrl}
                    download={downloadName}
                    className="rounded-xl border border-white/20 px-6 py-3 text-center text-sm text-white/80 hover:border-white/40"
                  >
                    Скачать готовое видео
                  </a>
                )}
                {error && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    Ошибка: {error}
                  </div>
                )}
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              <p className="font-semibold text-white/80">
                Оптимальные параметры TikTok 2025
              </p>
              <ul className="mt-2 space-y-1">
                <li>• H.264 High, CRF 18, 9:16, 1080x1920</li>
                <li>• GOP 60-120, Keyint фиксирован, faststart</li>
                <li>• AAC 128-192kbps, 48kHz</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="text-xs text-white/40">
          Все вычисления происходят локально в браузере. Видео не покидает
          устройство.
        </footer>
      </div>
    </main>
  );
}
