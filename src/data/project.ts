export interface Technology { id:string; name:string; category:string; description:string; tradeoff:string; accent:string }
export interface ProjectProblem { id:number; title:string; detail:string; impact:'HIGH'|'MEDIUM'|'LOW'; category:string; suggested:string[] }
export const technologies: Technology[] = [
  {id:'vue',name:'Vue 3',category:'FRONTEND',description:'Компонентный интерфейс с реактивным состоянием.',tradeoff:'Нужна единая система компонентов',accent:'#62b5a5'},
  {id:'typescript',name:'TypeScript',category:'LANGUAGE',description:'Типобезопасный контракт между командами.',tradeoff:'Больше времени на моделирование',accent:'#4f8ec8'},
  {id:'java',name:'Java + Spring',category:'BACKEND',description:'Надёжная основа для транзакционного API.',tradeoff:'Тяжелее быстрых прототипов',accent:'#d99058'},
  {id:'postgres',name:'PostgreSQL',category:'DATA',description:'Основное хранилище заказов и биллинга.',tradeoff:'Нужно следить за индексами',accent:'#6e9ac0'},
  {id:'kafka',name:'Apache Kafka',category:'EVENTS',description:'Асинхронные события между доменами.',tradeoff:'Сложность отладки потоков',accent:'#d0ae61'},
  {id:'k8s',name:'Kubernetes',category:'PLATFORM',description:'Автоматическое масштабирование сервисов.',tradeoff:'Цена операционной зрелости',accent:'#6b9ed5'},
  {id:'grafana',name:'Grafana + OTEL',category:'OBSERVABILITY',description:'Трейсы, метрики и понятные SLO.',tradeoff:'Потребуется дисциплина алертов',accent:'#d68e4f'},
  {id:'playwright',name:'Playwright',category:'QUALITY',description:'Сквозные тесты критических пользовательских путей.',tradeoff:'Тесты требуют поддержки',accent:'#76ae71'},
  {id:'redis',name:'Redis',category:'CACHE',description:'Быстрый cache и распределённые блокировки.',tradeoff:'Нужно продумать invalidation',accent:'#cf6659'},
  {id:'clickhouse',name:'ClickHouse',category:'ANALYTICS',description:'Быстрые аналитические запросы по событиям.',tradeoff:'Отдельный контур данных',accent:'#e2ad58'},
  {id:'s3',name:'S3 Storage',category:'STORAGE',description:'Надёжное объектное хранилище для файлов.',tradeoff:'Нужны lifecycle-политики',accent:'#d28d57'},
  {id:'prometheus',name:'Prometheus',category:'METRICS',description:'Метрики сервисов и алерты по SLO.',tradeoff:'Кардинальность требует контроля',accent:'#d77450'},
  {id:'argocd',name:'Argo CD',category:'DELIVERY',description:'GitOps-доставка окружений и откаты.',tradeoff:'Новая модель деплоя',accent:'#75a7ca'},
  {id:'docker',name:'Docker',category:'RUNTIME',description:'Воспроизводимые контейнеры для разработки.',tradeoff:'Нужно следить за образами',accent:'#65a6d1'},
  {id:'vault',name:'HashiCorp Vault',category:'SECURITY',description:'Централизованное хранение и выдача секретов.',tradeoff:'Появляется критичная зависимость',accent:'#c5a36b'},
  {id:'openapi',name:'OpenAPI',category:'CONTRACTS',description:'Единый контракт для публичных API.',tradeoff:'Контракт нужно поддерживать',accent:'#72b88c'},
  {id:'nginx',name:'NGINX',category:'EDGE',description:'Edge-маршрутизация, TLS и rate limiting.',tradeoff:'Ещё один слой конфигурации',accent:'#6fae84'}
]
export const projectProblems: ProjectProblem[] = [
  {id:1,title:'Пики нагрузки в день релиза',detail:'Checkout отвечает дольше 4 секунд при x5 трафике.',impact:'HIGH',category:'PERFORMANCE',suggested:['k8s','grafana','prometheus','redis']},
  {id:2,title:'Дублирование платежей',detail:'Повторная доставка webhook создаёт второй charge.',impact:'HIGH',category:'RELIABILITY',suggested:['java','postgres','redis','openapi']},
  {id:3,title:'Расходятся статусы заказа',detail:'Мобильное приложение видит заказ позже оператора.',impact:'HIGH',category:'CONSISTENCY',suggested:['kafka','postgres','java','clickhouse']},
  {id:4,title:'Медленный экран каталога',detail:'First meaningful paint превышает целевые 2 секунды.',impact:'MEDIUM',category:'FRONTEND',suggested:['vue','typescript','redis','nginx']},
  {id:5,title:'Нет трассировки между сервисами',detail:'Команда не может быстро найти место деградации.',impact:'MEDIUM',category:'OBSERVABILITY',suggested:['grafana','prometheus','k8s','docker']},
  {id:6,title:'Регрессия в промокодах',detail:'Критический happy path не покрыт сквозным тестом.',impact:'HIGH',category:'QUALITY',suggested:['playwright','typescript','openapi','docker']},
  {id:7,title:'Миграции блокируют deploy',detail:'Большие таблицы недоступны во время изменения схемы.',impact:'MEDIUM',category:'DATA',suggested:['postgres','java','clickhouse','s3']},
  {id:8,title:'Потеря событий доставки',detail:'Ночной batch иногда пропускает обновления статуса.',impact:'HIGH',category:'EVENTS',suggested:['kafka','grafana','clickhouse','redis']},
  {id:9,title:'Секреты в CI-логах',detail:'Токены случайно попадают в вывод сборки.',impact:'HIGH',category:'SECURITY',suggested:['vault','k8s','docker','nginx']},
  {id:10,title:'Нет плана отката',detail:'Последний релиз возвращали вручную почти два часа.',impact:'MEDIUM',category:'DELIVERY',suggested:['argocd','k8s','playwright','docker']}
]
