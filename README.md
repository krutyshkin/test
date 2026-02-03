# Unique 9:16 Studio

Полностью браузерный инструмент для уникализации вертикальных видео 9:16.

## Требования
- Node.js 18+
- pnpm / npm / yarn

## Установка и запуск
```bash
npm install
npm run dev
```

## Деплой на Vercel
1. Закоммитьте проект в GitHub.
2. Откройте [Vercel](https://vercel.com/) и импортируйте репозиторий.
3. Выберите preset **Next.js** (определится автоматически).
4. Никакие переменные окружения не нужны. Нажмите **Deploy**.

## FFmpeg параметры (TikTok 2025)
- H.264 High Profile, CRF 18
- 1080x1920, 9:16
- GOP 60-120 (фиксированный keyint)
- AAC 128-192kbps, 48kHz
- `-movflags +faststart`
