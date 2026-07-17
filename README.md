# KAVA MC

Премиальный сайт клубного MC, ведущего и event-продюсера Юрия Кавы.

## Локальный запуск

```bash
npm install
npm run dev
```

## Проверка

```bash
npm run lint
npm run build
```

## Фото

Схема файлов находится в `public/media/README.md`.

## Видео

Карточки видео находятся в `src/data/site.ts`. Заполните `videoUrl` внешней ссылкой или локальным путём. Тяжёлые исходники в GitHub не хранить.

## Заявки

API `/api/lead` умеет отправлять заявки:

- в Telegram Bot
- в webhook CRM или Google Sheets
- на email через Resend

Переменные перечислены в `.env.example`.

## Deployment

Основной production-проект: `kavamc.vercel.app`. Репозиторий: `kava-studia/kavamc`, ветка: `main`.
