# Tech Lead Simulator — Vue 3 frontend

Готовый SPA-прототип по предоставленным экранам. Включены тёмная тема, адаптивная вёрстка, роутинг, Pinia, mock API и подготовленный Axios-клиент для подключения Java backend.

## Запуск

```bash
cp .env.example .env


npm run dev
```

Открыть: `http://localhost:5173`.

## Сборка

```bash
npm run build
npm run preview
```

## Подключение backend

Frontend работает в режиме API-first: сначала обращается к backend и AI service,
а при сетевой ошибке, таймауте, пустом или невалидном ответе использует mock fallback.

```env
VITE_API_BASE_URL=/api
VITE_AI_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:8080
VITE_AI_PROXY_TARGET=http://localhost:8087
```

AI service должен предоставлять API под `/api/v1/ai`. В dev-режиме Vite
направляет этот префикс на `http://localhost:8087`; остальные `/api` запросы —
на основной backend.

Используемые AI endpoint-ы:

- `POST /api/v1/ai/questions/generate`
- `POST /api/v1/ai/interviews/result`

`questions/generate` получает профили четырёх выбранных кандидатов и одним
ответом возвращает вопрос вместе с четырьмя персонализированными репликами.
Клиент хранит в браузере последние 60 AI-вопросов и 120 AI-ответов, отправляет
их как запрещённую историю и добавляет уникальный ключ вариации для каждого
раунда. Сложность карьерного интервью растёт от `JUNIOR` до `SENIOR`; уровень
каждого виртуального кандидата определяется по его опыту.

Ожидаемые endpoint-ы основного backend находятся в `src/services/api.ts`:

- `GET /api/v1/candidates`
- `GET /api/v1/questions`
- `POST /api/v1/games/{gameId}/answers`
- `POST /api/v1/games/{gameId}/finish`

## Реализованные экраны

Главное меню, выбор режима, статистика, лобби, видеозвонок, вопрос, ответы кандидатов, промежуточная статистика, результат, подробная статистика, выбор команды, экран команды, финал и пауза.
