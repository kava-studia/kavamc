export const formats = [
  {
    eyebrow: "Формат 01",
    title: "KAVA MC Club Set",
    price: "15 000 ₽ + трансфер",
    text: "Работа поверх DJ-сета, точные выходы, объявления, импровизация и живой контакт с залом без навязчивых конкурсов.",
    tags: ["Связка с DJ", "Работа с залом", "Клубная энергия"],
  },
  {
    eyebrow: "Формат 02",
    title: "KAVA MC + Live Guitar",
    price: "30 000 ₽ + трансфер",
    text: "Электронная основа, MC и живая гитара. Rock, metal, drum and bass и rave собираются в энергичное клубное шоу.",
    tags: ["Живая гитара", "Рейв", "Сценическое шоу"],
    featured: true,
  },
  {
    eyebrow: "Формат 03",
    title: "Регулярные клубные слоты",
    price: "Индивидуальные условия",
    text: "Серия пятниц или суббот, резидентство, сезонные программы и отдельные тематические ночи.",
    tags: ["Резидентство", "Регулярные даты", "Серия событий"],
  },
  {
    eyebrow: "Формат 04",
    title: "Вечеринка под ключ",
    price: "Расчёт под задачу",
    text: "Концепция, название, программа, артисты, подрядчики, продвижение и личная работа MC в одном контуре.",
    tags: ["Концепция", "Продакшн", "Продвижение"],
  },
  {
    eyebrow: "Формат 05",
    title: "Частные и корпоративные события",
    price: "Индивидуальная стоимость",
    text: "Свадьбы, корпоративы, открытия, презентации, городские праздники и официальные события.",
    tags: ["Частные события", "Корпоративы", "Официальные события"],
  },
  {
    eyebrow: "Формат 06",
    title: "Продюсирование событий",
    price: "По брифу",
    text: "Разработка событийного направления, календаря, механики продвижения, команды и системы регулярных мероприятий.",
    tags: ["Стратегия", "Календарь", "Команда"],
  },
] as const;

export const venues = [
  { city: "Орск", names: "Мята · Мантра · Медведь" },
  { city: "Воронеж", names: "МОНЕ" },
  { city: "Сергиев Посад", names: "Ничего Личного · Sorry Mama · Дикобраз" },
];

export const media = [
  {
    id: "showreel",
    title: "KAVA MC Showreel",
    type: "Главное видео",
    venue: "Клубы · публика · атмосфера",
    year: "2026",
    poster: "/media/poster-showreel.webp",
    videoUrl: "/media/showreel-main.mp4",
    duration: "01:04",
  },
  {
    id: "club",
    title: "Клубный MC вживую",
    type: "Клубный сет",
    venue: "Ничего Личного",
    year: "2026",
    poster: "/media/poster-club.webp",
    videoUrl: "/media/club-live.mp4",
    duration: "00:11",
  },
  {
    id: "crowd",
    title: "Энергия зала",
    type: "Работа с публикой",
    venue: "Конфетти-момент",
    year: "2026",
    poster: "/media/poster-crowd.webp",
    videoUrl: "/media/crowd-energy.mp4",
    duration: "00:12",
  },
  {
    id: "sorry-mama",
    title: "Ночь в Sorry Mama",
    type: "Ночная программа",
    venue: "Sorry Mama",
    year: "2026",
    poster: "/media/poster-sorry.webp",
    videoUrl: "/media/sorry-mama.mp4",
    duration: "00:14",
  },
] as const;
