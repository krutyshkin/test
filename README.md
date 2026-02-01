# Vercel: Webapp + Serverless API

Этот репозиторий демонстрирует разделение backend API и webapp frontend для деплоя на Vercel.

## Структура проекта

- `api/` — серверлес backend функции (Node.js).
- `webapp/` — статический frontend.
- `vercel.json` — настройки маршрутизации для Vercel.

## Vercel serverless entrypoint

Функции в `api/` экспортируют handler вида `(req, res) => { ... }`. Vercel автоматически
разворачивает каждую функцию как serverless endpoint.

Пример: `api/hello.js` доступен по адресу `/api/hello`.

## Секреты через Vercel Env

Добавьте переменные окружения через **Vercel → Project → Settings → Environment Variables**.
Например:

- `SECRET_MESSAGE=super-secret-value`

Функция `api/hello.js` читает `process.env.SECRET_MESSAGE` и возвращает подсказку,
сконфигурирован ли секрет.

## Развёртывание на Vercel

1. Установите Vercel CLI (однократно):
   ```bash
   npm i -g vercel
   ```
2. Авторизуйтесь:
   ```bash
   vercel login
   ```
3. Запустите деплой из корня репозитория:
   ```bash
   vercel
   ```
4. Для продакшн деплоя:
   ```bash
   vercel --prod
   ```

## Локальная проверка

Можно использовать Vercel CLI для локального запуска:

```bash
vercel dev
```

После этого фронтенд будет доступен на `http://localhost:3000`, а API — на
`http://localhost:3000/api/hello`.
