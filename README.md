# Telegram Gift Market (бот + вебапп)

Этот проект — стартовая версия маркетплейса подарков Telegram: вебапп показывает профиль, баланс и список подарков в две колонки, а бот открывает маркет через кнопку `/start`.

## Возможности

- Профиль пользователя (аватар из Telegram, баланс в Stars, список подарков).
- Маркет с карточками подарков, поддержкой флага «улучшение»/«аукцион».
- Админские эндпоинты для баланса, блокировок и выдачи подарков.
- Валидация запросов через Zod и параметризованные SQL-запросы.
- Совместимость с Vercel (Next.js + Vercel Postgres).

## Архитектура

- **Next.js (App Router)** — UI + API роуты.
- **Vercel Postgres** — база данных.
- **Grammy** — Telegram бот.

## Быстрый старт (локально)

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Создайте `.env.local`:
   ```env
   TELEGRAM_BOT_TOKEN=123456:bot_token
   JWT_SECRET=super-secret
   ADMIN_IDS=123456789
   WEBAPP_URL=http://localhost:3000
   POSTGRES_URL=postgres://user:pass@host:5432/db
   ```
3. Создайте таблицы:
   ```bash
   npm run db:setup
   ```
4. Запустите вебапп:
   ```bash
   npm run dev
   ```
5. В другом терминале запустите бота:
   ```bash
   npm run bot:dev
   ```

## Деплой на Vercel

1. Создайте проект на Vercel и подключите репозиторий.
2. В разделе **Storage** создайте Postgres и скопируйте `POSTGRES_URL`.
3. Установите переменные окружения:
   - `TELEGRAM_BOT_TOKEN`
   - `ADMIN_IDS`
   - `WEBAPP_URL` (URL вашего Vercel-деплоя)
   - `POSTGRES_URL`
4. Выполните `npm run db:setup` через Vercel CLI или локально.

## API endpoints

- `GET /api/profile` — профиль пользователя.
- `GET /api/market/list` — список подарков.
- `POST /api/market/add` — добавить подарок (admin).
- `GET /api/gifts/lookup?gift=...` — получить детали подарка из Changes API.
- `POST /api/admin/balance` — изменить баланс (admin).
- `POST /api/admin/ban` — бан/разбан (admin).
- `POST /api/admin/grant` — выдать подарок (admin).
- `POST /api/admin/revoke` — убрать подарок (admin).

## Авторизация (Telegram WebApp initData)

Вебапп использует `https://telegram.org/js/telegram-web-app.js` и автоматически валидирует `initData` на сервере.
Для работы укажите `TELEGRAM_BOT_TOKEN` и `JWT_SECRET`. Приложение должно быть открыто внутри Telegram.

## Интеграция с Telegram Gift Changes API

Вебапп рассчитан на то, что вы будете добавлять подарки через `/api/market/add` по названию и ссылке на превью.
Для получения моделей/анимаций используйте:
- `https://cdn.changes.tg/gifts/...`

## Безопасность

- Проверка Telegram init data через HMAC.
- Валидация всех payload через Zod.
- Параметризованные SQL-запросы.

## Что дальше добавить

- Полноценную покупку через Telegram Stars Invoice.
- Логику аукционов/улучшений на уровне БД и UI.
- Синхронизацию с официальным API и Changes API.
