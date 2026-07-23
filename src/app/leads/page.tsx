"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./leads.module.css";

type Lead = {
  id: string;
  name: string;
  amenity: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  telegram: string;
  vk: string;
  instagram: string;
  opening_hours: string;
  cuisine: string;
  capacity: string;
  osm_url: string;
  score: number;
  priority: "A" | "B" | "C";
  priority_label: string;
  direct_contact: boolean;
  contact_channel: string;
  product: string;
  price: string;
  reason: string;
  decision_maker: string;
  pipeline_status: string;
  next_step: string;
};

type Payload = {
  generatedAt: string;
  source: string;
  area: string;
  stats: {
    raw: number;
    qualified: number;
    highPriority: number;
    directContact: number;
    writeNow: number;
    findDecisionMaker: number;
    research: number;
  };
  leads: Lead[];
};

type LeadActivity = {
  status?: string;
  note?: string;
  contactedAt?: string;
};

type ActivityMap = Record<string, LeadActivity>;

const STATUS_OPTIONS = [
  "Писать сейчас",
  "Найти ЛПР",
  "Проверить",
  "Сообщение отправлено",
  "Повторить через 3 дня",
  "Ответ получен",
  "Созвон назначен",
  "Договорились",
  "Отказ",
  "Неактуально",
];

const VENUE_LABELS: Record<string, string> = {
  nightclub: "Ночной клуб",
  events_venue: "Event-площадка",
  bar: "Бар",
  pub: "Паб",
  biergarten: "Биргартен",
  restaurant: "Ресторан",
};

function safeUrl(value: string) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function buildMessage(lead: Lead) {
  const intro = lead.city ? `Увидел ваше заведение в ${lead.city}.` : "Увидел ваше заведение.";
  const offer = lead.product.includes("Live Guitar")
    ? "Могу провести банкетную или специальную дату как ведущий MC, а также собрать формат MC + Live Guitar."
    : "Могу провести гостевую пятницу или субботу как MC: живой контакт с залом, поддержка DJ, интерактив без кринжа и нормальная динамика вечера.";

  return `Привет! Я Кава, клубный MC и ведущий. ${intro} ${lead.reason}. ${offer}\n\n${lead.product} - ${lead.price}. Можно начать с одной тестовой даты или обсудить регулярные выходы.\n\nКейсы и видео: kavamc.vercel.app\nTelegram: @kava_studia\n\nПодскажите, с кем можно обсудить программу и свободные даты?`;
}

function contactHref(lead: Lead) {
  if (lead.telegram) return safeUrl(lead.telegram.startsWith("@") ? `t.me/${lead.telegram.slice(1)}` : lead.telegram);
  if (lead.vk) return safeUrl(lead.vk);
  if (lead.instagram) return safeUrl(lead.instagram);
  if (lead.email) return `mailto:${lead.email}`;
  if (lead.phone) return `tel:${lead.phone.replace(/[^+\d]/g, "")}`;
  if (lead.website) return safeUrl(lead.website);
  return lead.osm_url;
}

export default function LeadsPage() {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Все города");
  const [type, setType] = useState("Все типы");
  const [priority, setPriority] = useState("Все приоритеты");
  const [stage, setStage] = useState("Писать сейчас");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState("");
  const [activity, setActivity] = useState<ActivityMap>({});
  const pageSize = 40;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("kava-mc-lead-activity-v1");
      if (stored) setActivity(JSON.parse(stored) as ActivityMap);
    } catch {
      // Local state is optional. The CRM still works without it.
    }

    fetch("/api/venues/leads")
      .then(async (response) => {
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
        return response.json() as Promise<Payload>;
      })
      .then(setPayload)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Не удалось загрузить базу"))
      .finally(() => setLoading(false));
  }, []);

  const saveActivity = (id: string, patch: LeadActivity) => {
    setActivity((current) => {
      const updated = { ...current, [id]: { ...current[id], ...patch } };
      window.localStorage.setItem("kava-mc-lead-activity-v1", JSON.stringify(updated));
      return updated;
    });
  };

  const cities = useMemo(() => {
    if (!payload) return [];
    return [...new Set(payload.leads.map((lead) => lead.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru"));
  }, [payload]);

  const types = useMemo(() => {
    if (!payload) return [];
    return [...new Set(payload.leads.map((lead) => lead.amenity))].sort();
  }, [payload]);

  const filtered = useMemo(() => {
    if (!payload) return [];
    const query = search.trim().toLowerCase().replace(/ё/g, "е");

    return payload.leads.filter((lead) => {
      const actualStage = activity[lead.id]?.status ?? lead.pipeline_status;
      const haystack = `${lead.name} ${lead.city} ${lead.address} ${lead.reason} ${lead.product}`.toLowerCase().replace(/ё/g, "е");
      return (!query || haystack.includes(query))
        && (city === "Все города" || lead.city === city)
        && (type === "Все типы" || lead.amenity === type)
        && (priority === "Все приоритеты" || lead.priority === priority)
        && (stage === "Все этапы" || actualStage === stage);
    });
  }, [payload, search, city, type, priority, stage, activity]);

  useEffect(() => setPage(1), [search, city, type, priority, stage]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const copyMessage = async (lead: Lead) => {
    await navigator.clipboard.writeText(buildMessage(lead));
    setCopiedId(lead.id);
    window.setTimeout(() => setCopiedId(""), 1800);
  };

  if (loading) {
    return <main className={styles.loading}>Собираю Подмосковье по кусочкам. Без паники, баров много.</main>;
  }

  if (error || !payload) {
    return <main className={styles.loading}>Не удалось загрузить базу: {error || "неизвестная ошибка"}</main>;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>KAVA MC SALES</p>
          <h1>Бары, рестораны и площадки Подмосковья</h1>
          <p className={styles.subtitle}>Не справочник. Очередь продаж: кому писать, что продавать и кого искать внутри заведения.</p>
        </div>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="/api/venues/leads?format=csv">Скачать CRM в CSV</a>
          <a className={styles.secondaryButton} href="/api/venues/leads?all=true&format=csv">Скачать все 1 642 точки</a>
        </div>
      </section>

      <section className={styles.stats}>
        <article><span>Сырых точек</span><strong>{payload.stats.raw.toLocaleString("ru-RU")}</strong></article>
        <article><span>Прошли отбор</span><strong>{payload.stats.qualified.toLocaleString("ru-RU")}</strong></article>
        <article><span>Высокий приоритет</span><strong>{payload.stats.highPriority.toLocaleString("ru-RU")}</strong></article>
        <article><span>Есть прямой контакт</span><strong>{payload.stats.directContact.toLocaleString("ru-RU")}</strong></article>
        <article><span>Писать сейчас</span><strong>{payload.stats.writeNow.toLocaleString("ru-RU")}</strong></article>
      </section>

      <section className={styles.workflow}>
        <button className={stage === "Писать сейчас" ? styles.activeStage : ""} onClick={() => setStage("Писать сейчас")}>1. Писать сейчас</button>
        <button className={stage === "Найти ЛПР" ? styles.activeStage : ""} onClick={() => setStage("Найти ЛПР")}>2. Найти ЛПР</button>
        <button className={stage === "Проверить" ? styles.activeStage : ""} onClick={() => setStage("Проверить")}>3. Проверить</button>
        <button className={stage === "Все этапы" ? styles.activeStage : ""} onClick={() => setStage("Все этапы")}>Все этапы</button>
      </section>

      <section className={styles.filters}>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Название, город, формат или причина" />
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option>Все города</option>
          {cities.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option>Все типы</option>
          {types.map((item) => <option key={item} value={item}>{VENUE_LABELS[item] ?? item}</option>)}
        </select>
        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option>Все приоритеты</option>
          <option value="A">A - высокий</option>
          <option value="B">B - средний</option>
          <option value="C">C - проверить</option>
        </select>
      </section>

      <section className={styles.resultHeader}>
        <div><strong>{filtered.length.toLocaleString("ru-RU")}</strong> лидов в текущей выборке</div>
        <div>Страница {page} из {pages}</div>
      </section>

      <section className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Приоритет</th>
              <th>Заведение</th>
              <th>Почему подходит</th>
              <th>Что продаём</th>
              <th>Контакт</th>
              <th>Этап</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((lead) => {
              const actualStatus = activity[lead.id]?.status ?? lead.pipeline_status;
              return (
                <tr key={lead.id}>
                  <td><span className={`${styles.priority} ${styles[`priority${lead.priority}`]}`}>{lead.priority}</span><small>{lead.score}</small></td>
                  <td>
                    <strong>{lead.name}</strong>
                    <span>{VENUE_LABELS[lead.amenity] ?? lead.amenity}{lead.city ? ` · ${lead.city}` : ""}</span>
                    <small>{lead.address || "Адрес требует проверки"}</small>
                  </td>
                  <td><p>{lead.reason}</p><small>Ищем: {lead.decision_maker}</small></td>
                  <td><strong>{lead.product}</strong><span>{lead.price}</span></td>
                  <td>
                    <a className={styles.contactLink} href={contactHref(lead)} target="_blank" rel="noreferrer">{lead.contact_channel}</a>
                    {lead.phone && <small>{lead.phone}</small>}
                    {lead.email && <small>{lead.email}</small>}
                  </td>
                  <td>
                    <select value={actualStatus} onChange={(event) => saveActivity(lead.id, {
                      status: event.target.value,
                      contactedAt: event.target.value === "Сообщение отправлено" ? new Date().toISOString() : activity[lead.id]?.contactedAt,
                    })}>
                      {STATUS_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className={styles.copyButton} onClick={() => copyMessage(lead)}>{copiedId === lead.id ? "Скопировано" : "Скопировать заход"}</button>
                    <a className={styles.sourceLink} href={lead.osm_url} target="_blank" rel="noreferrer">Проверить источник</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {visible.length === 0 && <div className={styles.empty}>По этим фильтрам никого нет. Это редкий момент, когда Подмосковье закончилось.</div>}

      <section className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Назад</button>
        <span>{page} / {pages}</span>
        <button disabled={page === pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}>Дальше</button>
      </section>

      <section className={styles.rules}>
        <h2>Как продавать, чтобы не улететь в спам-болото</h2>
        <div>
          <p><strong>20-30 касаний в день.</strong> Первая строка всегда персональная: афиша, интерьер, караоке, живая музыка или конкретная пятница.</p>
          <p><strong>Не продаём «ведущего вообще».</strong> Продаём тестовую дату, гостевую пятницу, поддержку DJ, банкет или регулярную резиденцию.</p>
          <p><strong>Повтор через 3 дня.</strong> Без романа в трёх томах: «Добрый день, возвращаюсь к предложению. С кем лучше обсудить даты?»</p>
        </div>
      </section>

      <footer className={styles.footer}>
        Данные собраны из открытой картографической базы OpenStreetMap. Перед контактом проверяй актуальность площадки, сайта и телефона. Рабочие статусы сохраняются только в этом браузере.
      </footer>
    </main>
  );
}
