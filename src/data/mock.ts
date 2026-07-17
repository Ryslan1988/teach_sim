import type { Candidate, Question } from '@/types/game'

export const candidates: Candidate[] = [
  { id: 'maria', name: 'Мария', role: 'Frontend Developer', initials: 'М', accent: '#e07a5f', skills: ['Vue 3', 'TypeScript', 'UI Architecture'], answers: 0, summary: 'Сильна в интерфейсной архитектуре и умеет защищать решения через данные.', experience: '6 лет · SaaS', portraitIndex: 4 },
  { id: 'alex', name: 'Алексей', role: 'Backend Developer', initials: 'А', accent: '#f2a65a', skills: ['Java', 'Spring Boot', 'PostgreSQL'], answers: 0, summary: 'Любит ясные контракты, наблюдаемость и решения, которые спокойно переживают нагрузку.', experience: '8 лет · FinTech', portraitIndex: 0 },
  { id: 'igor', name: 'Игорь', role: 'DevOps Engineer', initials: 'И', accent: '#2a9d8f', skills: ['Kubernetes', 'CI/CD', 'Observability'], answers: 0, summary: 'Превращает инфраструктуру в предсказуемую платформу для продуктовых команд.', experience: '7 лет · Cloud', portraitIndex: 1 },
  { id: 'dmitry', name: 'Дмитрий', role: 'QA Engineer', initials: 'Д', accent: '#457b9d', skills: ['Automation', 'API testing', 'Performance'], answers: 0, summary: 'Строит надёжные процессы качества и умеет говорить с разработчиками на одном языке.', experience: '6 лет · FinTech', portraitIndex: 2 },
  { id: 'sofia', name: 'София', role: 'Frontend Developer', initials: 'С', accent: '#8f738b', skills: ['React', 'Web Performance', 'A11y'], answers: 0, summary: 'Ускоряет интерфейсы и превращает сложные сценарии в понятный пользовательский опыт.', experience: '4 года · E-commerce', portraitIndex: 5 },
  { id: 'aisha', name: 'Аиша', role: 'Data Engineer', initials: 'А', accent: '#9a7657', skills: ['Python', 'Airflow', 'BigQuery'], answers: 0, summary: 'Проектирует устойчивые пайплайны данных и не боится больших объёмов.', experience: '7 лет · Analytics', portraitIndex: 6 },
  { id: 'maxim', name: 'Максим', role: 'Solutions Architect', initials: 'М', accent: '#60798a', skills: ['Cloud', 'Event-driven', 'Security'], answers: 0, summary: 'Видит систему целиком и умеет объяснять архитектурные решения бизнесу.', experience: '9 лет · Cloud', portraitIndex: 3 },
  { id: 'daniil', name: 'Даниил', role: 'Backend Developer', initials: 'Д', accent: '#657e82', skills: ['Go', 'gRPC', 'PostgreSQL'], answers: 0, summary: 'Спокойно разбирает узкие места и пишет сервисы, которые выдерживают рост.', experience: '5 лет · Logistics', portraitIndex: 8 },
  { id: 'elena', name: 'Елена', role: 'Engineering Manager', initials: 'Е', accent: '#a07b63', skills: ['Leadership', 'Hiring', 'Delivery'], answers: 0, summary: 'Выстраивает команды и процессы так, чтобы сильные люди могли работать сильнее.', experience: '10 лет · B2B', portraitIndex: 7 },
  { id: 'nina', name: 'Нина', role: 'Mobile Developer', initials: 'Н', accent: '#93785d', skills: ['Swift', 'Kotlin', 'Offline-first'], answers: 0, summary: 'Делает мобильные продукты быстрыми и надёжными даже в плохой сети.', experience: '6 лет · Travel', portraitIndex: 12 },
  { id: 'kenji', name: 'Кенджи', role: 'Platform Engineer', initials: 'К', accent: '#5d7f89', skills: ['Kubernetes', 'Terraform', 'SRE'], answers: 0, summary: 'Автоматизирует инфраструктуру и измеряет надёжность цифрами.', experience: '8 лет · Media', portraitIndex: 9 },
  { id: 'timur', name: 'Тимур', role: 'Security Engineer', initials: 'Т', accent: '#6f806d', skills: ['Threat modeling', 'AppSec', 'Go'], answers: 0, summary: 'Находит риски до релиза и помогает командам не бояться безопасности.', experience: '7 лет · Banking', portraitIndex: 10 },
  { id: 'olga', name: 'Ольга', role: 'QA Automation', initials: 'О', accent: '#a47b68', skills: ['Playwright', 'CI/CD', 'Contract tests'], answers: 0, summary: 'Строит быстрый feedback loop и делает качество частью разработки.', experience: '4 года · Retail', portraitIndex: 13 },
  { id: 'yulia', name: 'Юлия', role: 'Tech Lead', initials: 'Ю', accent: '#7a7181', skills: ['Architecture', 'Mentoring', 'Vue'], answers: 0, summary: 'Любит сложные миграции, ясные договорённости и здоровую инженерную культуру.', experience: '8 лет · Marketplace', portraitIndex: 15 },
  { id: 'artem', name: 'Артём', role: 'Product Engineer', initials: 'А', accent: '#927154', skills: ['TypeScript', 'Node.js', 'Experimentation'], answers: 0, summary: 'Быстро превращает идеи в работающие продукты и измеряет результат.', experience: '5 лет · Startup', portraitIndex: 11 },
  { id: 'mila', name: 'Мила', role: 'Product Designer', initials: 'М', accent: '#c27858', skills: ['Figma', 'Design systems', 'Research'], answers: 0, summary: 'Соединяет продуктовую эмпатию с системным мышлением и любит проверять гипотезы.', experience: '5 лет · SaaS', portraitIndex: 16 },
  { id: 'roman', name: 'Роман', role: 'ML Engineer', initials: 'Р', accent: '#6c776f', skills: ['Python', 'PyTorch', 'MLOps'], answers: 0, summary: 'Переводит исследовательские модели в понятные и поддерживаемые сервисы.', experience: '6 лет · HealthTech', portraitIndex: 14 },
  { id: 'pavel', name: 'Павел', role: 'Principal Engineer', initials: 'П', accent: '#8d6c5b', skills: ['Distributed systems', 'Java', 'Mentoring'], answers: 0, summary: 'Сильный системный инженер, который умеет поднимать планку всей команды.', experience: '12 лет · Enterprise', portraitIndex: 18 },
  { id: 'darya', name: 'Дарья', role: 'Developer Advocate', initials: 'Д', accent: '#957b68', skills: ['DX', 'Documentation', 'Community'], answers: 0, summary: 'Помогает разработчикам быстро понимать продукт и делает сложное доступным.', experience: '5 лет · Developer Tools', portraitIndex: 17 },
  { id: 'viktor', name: 'Виктор', role: 'Research Engineer', initials: 'В', accent: '#847595', skills: ['Prototyping', 'Python', 'Experiments'], answers: 0, summary: 'Проверяет идеи короткими циклами и приносит в команду свежий взгляд.', experience: '4 года · R&D', portraitIndex: 19 }
]

export const questions: Question[] = [
  {
    id: 1, category: 'Java', title: 'Что описывает принцип SOLID — Dependency Inversion?', timeLimit: 45,
    answers: [
      { id: '1a', candidateId: 'alex', text: 'Зависеть от абстракций, а не от конкретных реализаций.', correct: true },
      { id: '1b', candidateId: 'maria', text: 'Объединять все зависимости в одном сервисе.', correct: false },
      { id: '1c', candidateId: 'igor', text: 'Всегда использовать статические методы.', correct: false },
      { id: '1d', candidateId: 'dmitry', text: 'Исключить интерфейсы из проекта.', correct: false }
    ]
  },
  {
    id: 2, category: 'JVM', title: 'Как работает сборщик мусора в Java?', timeLimit: 45,
    answers: [
      { id: '2a', candidateId: 'igor', text: 'Освобождает память объектов, которые больше недостижимы из GC Roots.', correct: true },
      { id: '2b', candidateId: 'alex', text: 'Удаляет объекты сразу после выхода из метода.', correct: false },
      { id: '2c', candidateId: 'maria', text: 'Запускается только вручную через System.gc().', correct: false },
      { id: '2d', candidateId: 'dmitry', text: 'Работает только со строками и коллекциями.', correct: false }
    ]
  },
  {
    id: 3, category: 'SQL', title: 'Как бы вы оптимизировали медленный SQL-запрос?', timeLimit: 45,
    answers: [
      { id: '3a', candidateId: 'alex', text: 'Проверю план выполнения, селективность и добавлю подходящие индексы.', correct: true },
      { id: '3b', candidateId: 'igor', text: 'Увеличу память сервера без анализа запроса.', correct: false },
      { id: '3c', candidateId: 'maria', text: 'Буду кэшировать все запросы без ограничений.', correct: false },
      { id: '3d', candidateId: 'dmitry', text: 'Перепишу SQL на NoSQL независимо от задачи.', correct: false }
    ]
  },
  {
    id: 4, category: 'API', title: 'Когда gRPC предпочтительнее REST?', timeLimit: 45,
    answers: [
      { id: '4a', candidateId: 'maria', text: 'Когда важны строгие контракты, производительность и межсервисное взаимодействие.', correct: true },
      { id: '4b', candidateId: 'alex', text: 'Для любого публичного браузерного API без прокси.', correct: false },
      { id: '4c', candidateId: 'dmitry', text: 'Когда нельзя использовать protobuf.', correct: false },
      { id: '4d', candidateId: 'igor', text: 'Только для загрузки статических файлов.', correct: false }
    ]
  },
  {
    id: 5, category: 'Database', title: 'Что такое индекс в базе данных?', timeLimit: 45,
    answers: [
      { id: '5a', candidateId: 'dmitry', text: 'Дополнительная структура данных, ускоряющая поиск ценой памяти и записи.', correct: true },
      { id: '5b', candidateId: 'maria', text: 'Резервная копия всей таблицы.', correct: false },
      { id: '5c', candidateId: 'alex', text: 'Способ автоматически удалить дубликаты.', correct: false },
      { id: '5d', candidateId: 'igor', text: 'Протокол сетевого взаимодействия.', correct: false }
    ]
  },
  {
    id: 6, category: 'Kafka', title: 'Что обеспечивает consumer group в Kafka?', timeLimit: 45,
    answers: [
      { id: '6a', candidateId: 'igor', text: 'Распределение партиций топика между consumers одной группы.', correct: true },
      { id: '6b', candidateId: 'maria', text: 'Шифрование сообщений.', correct: false },
      { id: '6c', candidateId: 'alex', text: 'Создание новых брокеров.', correct: false },
      { id: '6d', candidateId: 'dmitry', text: 'Сортировку всех сообщений глобально.', correct: false }
    ]
  },
  {
    id: 7, category: 'Architecture', title: 'Зачем используют паттерн Outbox?', timeLimit: 45,
    answers: [
      { id: '7a', candidateId: 'alex', text: 'Для согласованной записи бизнес-данных и события в рамках одной транзакции.', correct: true },
      { id: '7b', candidateId: 'maria', text: 'Для хранения frontend-ассетов.', correct: false },
      { id: '7c', candidateId: 'igor', text: 'Для замены базы данных очередью.', correct: false },
      { id: '7d', candidateId: 'dmitry', text: 'Для отключения ретраев.', correct: false }
    ]
  },
  {
    id: 8, category: 'Spring', title: 'Какой scope используется Spring-бином по умолчанию?', timeLimit: 45,
    answers: [
      { id: '8a', candidateId: 'maria', text: 'Singleton внутри ApplicationContext.', correct: true },
      { id: '8b', candidateId: 'alex', text: 'Prototype.', correct: false },
      { id: '8c', candidateId: 'dmitry', text: 'Request.', correct: false },
      { id: '8d', candidateId: 'igor', text: 'Session.', correct: false }
    ]
  },
  {
    id: 9, category: 'Kubernetes', title: 'Для чего нужен readiness probe?', timeLimit: 45,
    answers: [
      { id: '9a', candidateId: 'igor', text: 'Определить, готов ли контейнер принимать трафик.', correct: true },
      { id: '9b', candidateId: 'maria', text: 'Проверить наличие Dockerfile.', correct: false },
      { id: '9c', candidateId: 'alex', text: 'Автоматически увеличить CPU контейнера.', correct: false },
      { id: '9d', candidateId: 'dmitry', text: 'Удалить pod после каждого запроса.', correct: false }
    ]
  },
  {
    id: 10, category: 'Testing', title: 'Что дает Testcontainers в интеграционных тестах?', timeLimit: 45,
    answers: [
      { id: '10a', candidateId: 'dmitry', text: 'Запуск реальных зависимостей в изолированных контейнерах на время тестов.', correct: true },
      { id: '10b', candidateId: 'alex', text: 'Генерацию unit-тестов без кода.', correct: false },
      { id: '10c', candidateId: 'maria', text: 'Замену assertions логированием.', correct: false },
      { id: '10d', candidateId: 'igor', text: 'Публикацию приложения в production.', correct: false }
    ]
  }
]
