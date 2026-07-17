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

По умолчанию используется mock-режим:

```env
VITE_USE_MOCKS=true
```

Для интеграции с backend:

```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:8080
```

Ожидаемые endpoint-ы находятся в `src/services/api.ts`:

- `GET /api/v1/candidates`
- `GET /api/v1/questions`
- `POST /api/v1/games/{gameId}/answers`
- `POST /api/v1/games/{gameId}/finish`

## Реализованные экраны

Главное меню, выбор режима, статистика, лобби, видеозвонок, вопрос, ответы кандидатов, промежуточная статистика, результат, подробная статистика, выбор команды, экран команды, финал и пауза.
