export const formats = [
  {
    eyebrow: "Формат 01",
    title: "KAVA MC Club Set",
    price: "15 000 ₽ + трансфер",
    text: "Работа поверх DJ-сета, объявления, импровизация, контакт с залом и поддержка ключевых моментов вечера.",
    tags: ["DJ interaction", "Crowd work", "Club energy"],
  },
  {
    eyebrow: "Формат 02",
    title: "KAVA MC + Live Guitar",
    price: "30 000 ₽ + трансфер",
    text: "Клубное live-шоу на стыке электронной музыки, rock, metal и drum and bass с живой гитарой.",
    tags: ["Live guitar", "Rave", "Stage show"],
    featured: true,
  },
  {
    eyebrow: "Формат 03",
    title: "Регулярные клубные слоты",
    price: "Индивидуальные условия",
    text: "Серия пятниц или суббот, резидентство, сезонные программы и отдельные тематические ночи.",
    tags: ["Residency", "Weekly slots", "Series"],
  },
  {
    eyebrow: "Формат 04",
    title: "Вечеринка под ключ",
    price: "Расчёт под задачу",
    text: "Концепция, название, сценарная структура, артисты, подрядчики, продвижение и личная работа MC.",
    tags: ["Concept", "Production", "Marketing"],
  },
  {
    eyebrow: "Формат 05",
    title: "Частные и корпоративные события",
    price: "Индивидуальная стоимость",
    text: "Свадьбы, корпоративы, открытия, презентации, городские праздники и официальные события.",
    tags: ["Private", "Corporate", "Official"],
  },
  {
    eyebrow: "Формат 06",
    title: "Event Production",
    price: "По брифу",
    text: "Разработка регулярного событийного формата, календаря вечеринок, механики продвижения и команды.",
    tags: ["Strategy", "Calendar", "Team"],
  },
] as const;

export const venues = [
  { city: "Орск", names: "Мята · Мантра · Медведь" },
  { city: "Воронеж", names: "МОНЕ · Робин Сдобин" },
  { city: "Сергиев Посад", names: "Ничего Личного · Sorry Mama · Дикобраз" },
];

export const media = [
  {
    id: "club",
    title: "Club MC Show",
    type: "Клубный сет",
    venue: "DJ-сет и работа с залом",
    year: "2026",
    poster: "/media/club.svg",
    videoUrl: "",
  },
  {
    id: "live",
    title: "KAVA MC + Live Guitar",
    type: "Live-формат",
    venue: "Rock · DnB · Rave",
    year: "2026",
    poster: "/media/live.svg",
    videoUrl: "",
  },
  {
    id: "event",
    title: "Event Host",
    type: "Частные события",
    venue: "Свадьбы и корпоративы",
    year: "2026",
    poster: "/media/event.svg",
    videoUrl: "",
  },
] as const;
