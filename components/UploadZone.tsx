"use client";

import { useCallback, useState } from "react";

type UploadZoneProps = {
  file: File | null;
  onFileSelect: (file: File) => void;
};

const ACCEPTED_TYPES = ["video/mp4", "video/quicktime"];

export default function UploadZone({ file, onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const candidate = files[0];
      if (!ACCEPTED_TYPES.includes(candidate.type)) {
        alert("Поддерживаются только MP4 и MOV файлы.");
        return;
      }
      onFileSelect(candidate);
    },
    [onFileSelect]
  );

  return (
    <label
      className={`gradient-border card flex flex-col items-center justify-center gap-4 p-8 text-center transition-all ${
        isDragging ? "scale-[1.01] border-white/30" : "border-white/10"
      }`}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        type="file"
        className="hidden"
        accept="video/mp4,video/quicktime"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="text-sm uppercase tracking-[0.3em] text-white/60">
        Drag & Drop
      </div>
      <div className="text-2xl font-semibold">
        {file ? file.name : "Загрузите MP4 / MOV"}
      </div>
      <p className="text-sm text-white/60">
        Мы обработаем видео полностью в браузере без серверов.
      </p>
    </label>
  );
}
