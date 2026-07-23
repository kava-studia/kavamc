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
  latitude: number | string;
  longitude: number | string;
  osm_updated_at: string;
  yandex_maps_url: string;
  osm_url: string;
  score: number;
  nightlife_score: number;
  priority: "A" | "B" | "C";
  priority_label: string;
  nightlife_relevant: boolean;
  late_hours: boolean;
  venue_segment: string;
  direct_contact: boolean;
  contact_channel: string;
  product: string;
  price: string;
  reason: string;
  decision_maker: string;
  pipeline_status: string;
  next_step: string;
  actuality_status: string;
  actuality_reason: string;
  actuality_checked_at: string;
};

type Payload = {
  generatedAt: string;
  source: string;
  area: string;
  focus: string;
  stats: {
    raw: number;
    nightlife: number;
    qualified: number;
    highPriority: number;
    directContact: number;
    writeNow: number;
    findDecisionMaker: number;
    research: number;
    nightclubs: number;
    restobars: number;
    karaoke: number;
    bars: number;
    lateVenues: number;
    freshData: number;
  };
  leads: Lead[];
};

type LeadActivity = {
  status?: string;
  note?: string;
  contactedAt?: string;
};

type ActivityMap = Record<string, LeadActivity>;

type VerificationResult = {
  id: string;
  status: string;
  reason: string;
  checkedAt: string;
  websiteReachable: boolean;
  websiteStatus: number | null;
  websiteFinalUrl: string;
};

type VerificationMap = Record<string, VerificationResult>;

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

function safeUrl(value: string) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function buildMessage(lead: Lead) {
  const intro = lead.city ? `Увидел ваше заведение в ${lead.city}.` : "Увидел ваше заведение.";
  const segment = lead.venue_segment.toLowerCase();
  const offer = segment.includes("клуб") || segment.includes("рестобар") || segment.includes("караоке") || segment.includes("бар")
    ? "Могу провести гостевую пятницу или субботу как MC: живой контакт с залом, поддержка DJ, интерактив без кринжа и нормальная динамика вечера."
    : "Могу собрать специальную дату как ведущий MC, а при необходимости добавить формат MC + Live Guitar.";

  return `Привет! Я Кава, клубный MC и ведущий. ${intro} ${lead.reason}. ${offer}\n\n${lead.product} - ${lead.price}. Можно начать с одной тестовой даты или обсудить регулярные выходы.\n\nКейсы и видео: kavamc.vercel.app\nTelegram: @kava_studia\n\nПодскажите, с кем можно обсудить программу и свободные даты?`;
}

function contactHref(lead: Lead) {
  if (lead.telegram) return safeUrl(lead.telegram.startsWith("@") ? `t.me/${lead.telegram.slice(1)}` : lead.telegram);
  if (lead.vk) return safeUrl(lead.vk);
  if (lead.instagram) return safeUrl(lead.instagram);
  if (lead.email) return `mailto:${lead.email}`;
  if (lead.phone) return `tel:${lead.phone.replace(/[^+\d]/g, "")}`;
  if (lead.website) return safeUrl(lead.website);
  return lead.yandex_maps_url || lead.osm_url;
}

function formatCheckedAt(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });
}

export default function LeadsPage() {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Все города");
  const [segment, setSegment] = useState("Все форматы");
  const [priority, setPriority] = useState("Все приоритеты");
  const [actuality, setActuality] = useState("Все статусы");
  const [stage, setStage] = useState("Писать сейчас");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState("");
  const [activity, setActivity] = useState<ActivityMap>({});
  const [verification, setVerification] = useState<VerificationMap>({});
  const [verifying, setVerifying] = useState(false);
  const pageSize = 40;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("kava-mc-lead-activity-v1");
      if (stored) setActivity(JSON.parse(stored) as ActivityMap);
      const verified = window.localStorage.getItem("kava-mc-lead-verification-v1");
      if (verified) setVerification(JSON.parse(verified) as VerificationMap);
    } catch {
      // CRM remains usable if local storage is unavailable.
    }

    fetch("/api/venues/leads?focus=nightlife")
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

  const segments = useMemo(() => {
    if (!payload) return [];
    return [...new Set(payload.leads.map((lead) => lead.venue_segment).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru"));
  }, [payload]);

  const filtered = useMemo(() => {
    if (!payload) return [];
    const query = search.trim().toLowerCase().replace(/ё/g, "е");

    return payload.leads.filter((lead) => {
      const actualStage = activity[lead.id]?.status ?? lead.pipeline_status;
      const liveActuality = verification[lead.id]?.status ?? lead.actuality_status;
      const haystack = `${lead.name} ${lead.city} ${lead.address} ${lead.reason} ${lead.product} ${lead.venue_segment}`.toLowerCase().replace(/ё/g, "е");
      return (!query || haystack.includes(query))
        && (city === "Все города" || lead.city === city)
        && (segment === "Все форматы" || lead.venue_segment === segment)
        && (priority === "Все приоритеты" || lead.priority === priority)
        && (actuality === "Все статусы" || liveActuality === actuality)
        && (stage === "Все этапы" || actualStage === stage);
    });
  }, [payload, search, city, segment, priority, actuality, stage, activity, verification]);

  useEffect(() => setPage(1), [search, city, segment, priority, actuality, stage]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const visibleKey = visible.map((lead) => lead.id).join(",");

  useEffect(() => {
    if (!visibleKey) return;
    const pending = visible.filter((lead) => !verification[lead.id]);
    if (pending.length === 0) return;

    setVerifying(true);
    fetch("/api/venues/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leads: pending.map((lead) => ({
          id: lead.id,
          website: lead.website,
          phone: lead.phone,
          email: lead.email,
          telegram: lead.telegram,
          vk: lead.vk,
          instagram: lead.instagram,
        })),
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Ошибка актуализации: ${response.status}`);
        return response.json() as Promise<{ results: VerificationResult[] }>;
      })
      .then(({ results }) => {
        setVerification((current) => {
          const updated = { ...current };
          for (const result of results) updated[result.id] = result;
          window.localStorage.setItem("kava-mc-lead-verification-v1", JSON.stringify(updated));
          return updated;
        });
      })
      .catch(() => {
        // Base actuality from fresh OSM data remains visible if website verification fails.
      })
      .finally(() => setVerifying(false));
    // visibleKey intentionally represents the current page batch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleKey]);

  const copyMessage = async (lead: Lead) => {
    await navigator.clipboard.writeText(buildMessage(lead));
    setCopiedId(lead.id);
    window.setTimeout(() => setCopiedId(""), 1800);
  };

  if (loading) {
    return <main className={styles.loading}>Собираю ночную жизнь Подмосковья. Тут баров больше, чем обещаний начать новую жизнь с понедельника.</main>;
  }

  if (error || !payload) {
    return <main className={styles.loading}>Не удалось загрузить базу: {error || "неизвестная ошибка"}</main>;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>KAVA MC NIGHTLIFE SALES</p>
          <h1>Ночные клубы, рестобары и караоке Подмосковья</h1>
          <p className={styles.subtitle}>Приоритет не на рестораны вообще, а на места, где есть DJ, поздний график, вечеринки, караоке, музыка и аудитория для MC.</p>
        </div>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="/api/venues/leads?focus=nightlife&format=csv">Скачать ночную CRM</a>
          <a className={styles.secondaryButton} href="/api/venues/leads?all=true&format=csv">Скачать весь сырой массив</a>
        </div>
      </section>

      <section className={styles.stats}>
        <article><span>Ночная выборка</span><strong>{payload.stats.qualified.toLocaleString("ru-RU")}</strong></article>
        <article><span>Ночные клубы</span><strong>{payload.stats.nightclubs.toLocaleString("ru-RU")}</strong></article>
        <article><span>Рестобары / лаунжи</span><strong>{payload.stats.restobars.toLocaleString("ru-RU")}</strong></article>
        <article><span>Поздний график</span><strong>{payload.stats.lateVenues.toLocaleString("ru-RU")}</strong></article>
        <article><span>Писать сейчас</span><strong>{payload.stats.writeNow.toLocaleString("ru-RU")}</strong></article>
      </section>

      <section className={styles.workflow}>
        <button className={stage === "Писать сейчас" ? styles.activeStage : ""} onClick={() => setStage("Писать сейчас")}>1. Писать сейчас</button>
        <button className={stage === "Найти ЛПР" ? styles.activeStage : ""} onClick={() => setStage("Найти ЛПР")}>2. Найти ЛПР</button>
        <button className={stage === "Проверить" ? styles.activeStage : ""} onClick={() => setStage("Проверить")}>3. Проверить</button>
        <button className={stage === "Все этапы" ? styles.activeStage : ""} onClick={() => setStage("Все этапы")}>Все этапы</button>
      </section>

      <section className={styles.filters}>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Название, город, клуб, рестобар или караоке" />
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option>Все города</option>
          {cities.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={segment} onChange={(event) => setSegment(event.target.value)}>
          <option>Все форматы</option>
          {segments.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option>Все приоритеты</option>
          <option value="A">A - лучший матч</option>
          <option value="B">B - подходит</option>
          <option value="C">C - проверить</option>
        </select>
        <select value={actuality} onChange={(event) => setActuality(event.target.value)}>
          <option>Все статусы</option>
          <option>Сайт отвечает</option>
          <option>Контакт найден - проверить карту</option>
          <option>Нужна проверка в Яндекс Картах</option>
          <option>Свежие данные</option>
          <option>Вероятно актуально</option>
          <option>Проверить вручную</option>
        </select>
      </section>

      <section className={styles.resultHeader}>
        <div><strong>{filtered.length.toLocaleString("ru-RU")}</strong> лидов в текущей выборке</div>
        <div>{verifying ? "Проверяю сайты текущей страницы..." : `Страница ${page} из ${pages}`}</div>
      </section>

      <section className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Приоритет</th>
              <th>Заведение</th>
              <th>Актуальность</th>
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
              const liveCheck = verification[lead.id];
              const actualityStatus = liveCheck?.status ?? lead.actuality_status;
              const actualityReason = liveCheck?.reason ?? lead.actuality_reason;
              const checkedAt = liveCheck?.checkedAt ?? lead.actuality_checked_at;

              return (
                <tr key={lead.id}>
                  <td><span className={`${styles.priority} ${styles[`priority${lead.priority}`]}`}>{lead.priority}</span><small>{lead.score}</small></td>
                  <td>
                    <strong>{lead.name}</strong>
                    <span>{lead.venue_segment}{lead.city ? ` · ${lead.city}` : ""}</span>
                    <small>{lead.address || "Адрес требует проверки"}</small>
                    {lead.opening_hours && <small>График: {lead.opening_hours}</small>}
                    <a className={styles.sourceLink} href={lead.yandex_maps_url} target="_blank" rel="noreferrer">Открыть в Яндекс Картах</a>
                  </td>
                  <td>
                    <strong>{actualityStatus}</strong>
                    <span>{actualityReason}</span>
                    <small>Проверено: {formatCheckedAt(checkedAt)}</small>
                  </td>
                  <td><p>{lead.reason}</p><small>Ищем: {lead.decision_maker}</small></td>
                  <td><strong>{lead.product}</strong><span>{lead.price}</span></td>
                  <td>
                    <a className={styles.contactLink} href={contactHref(lead)} target="_blank" rel="noreferrer">{lead.contact_channel}</a>
                    {lead.phone && <small>{lead.phone}</small>}
                    {lead.email && <small>{lead.email}</small>}
                    {lead.website && <a className={styles.sourceLink} href={safeUrl(lead.website)} target="_blank" rel="noreferrer">Официальный сайт</a>}
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
                    <a className={styles.sourceLink} href={lead.yandex_maps_url} target="_blank" rel="noreferrer">Яндекс Карты</a>
                    <a className={styles.sourceLink} href={lead.osm_url} target="_blank" rel="noreferrer">Исходная карточка</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {visible.length === 0 && <div className={styles.empty}>По этим фильтрам никого нет. Значит, фильтры сейчас строже фейсконтроля в 2007 году.</div>}

      <section className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Назад</button>
        <span>{page} / {pages}</span>
        <button disabled={page === pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}>Дальше</button>
      </section>

      <section className={styles.rules}>
        <h2>Что теперь считается актуальным</h2>
        <div>
          <p><strong>Сайт отвечает.</strong> Автоматическая проверка подтвердила, что официальный сайт доступен прямо сейчас.</p>
          <p><strong>Яндекс Карты обязательны.</strong> Перед сообщением проверяем статус работы, свежие отзывы, афишу и вечерний график.</p>
          <p><strong>Приоритет ночной жизни.</strong> Обычные рестораны без музыки и позднего формата больше не забивают первую очередь.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        Автоматическая актуализация подтверждает свежесть исходной карты и доступность официального сайта. Финальный статус работы заведения подтверждай по Яндекс Картам и последним отзывам перед первым касанием.
      </footer>
    </main>
  );
}
