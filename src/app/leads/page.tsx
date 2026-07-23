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
  two_gis_url: string;
  google_search_url: string;
  instagram_search_url: string;
  vk_search_url: string;
  osm_url: string;
  score: number;
  nightlife_score: number;
  priority: "A" | "B" | "C";
  priority_label: string;
  nightlife_relevant: boolean;
  false_positive: boolean;
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
    rejectedFalsePositives?: number;
  };
  leads: Lead[];
};

type LeadActivity = {
  status?: string;
  note?: string;
  contactedAt?: string;
};

type ActivityMap = Record<string, LeadActivity>;

type SourceLink = {
  label: string;
  url: string;
  kind: "website" | "instagram" | "vk" | "maps" | "directory" | "web";
  snippet: string;
};

type VerificationResult = {
  id: string;
  status: string;
  reason: string;
  confidence: "high" | "medium" | "low";
  exclude: boolean;
  evidenceCount: number;
  checkedAt: string;
  websiteReachable: boolean;
  websiteStatus: number | null;
  websiteFinalUrl: string;
  instagramUrl: string;
  vkUrl: string;
  sourceLinks: SourceLink[];
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

const ACTUALITY_OPTIONS = [
  "Все статусы",
  "Подтверждено",
  "Вероятно работает",
  "Нужна ручная проверка",
  "Закрыто / исключить",
  "Не тот формат",
  "Не проверено",
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

function contactHref(lead: Lead, verification?: VerificationResult) {
  if (lead.telegram) return safeUrl(lead.telegram.startsWith("@") ? `t.me/${lead.telegram.slice(1)}` : lead.telegram);
  if (lead.instagram) return safeUrl(lead.instagram);
  if (verification?.instagramUrl) return verification.instagramUrl;
  if (lead.vk) return safeUrl(lead.vk);
  if (verification?.vkUrl) return verification.vkUrl;
  if (lead.email) return `mailto:${lead.email}`;
  if (lead.phone) return `tel:${lead.phone.replace(/[^+\d]/g, "")}`;
  if (lead.website) return safeUrl(lead.website);
  return lead.yandex_maps_url || lead.osm_url;
}

function contactLabel(lead: Lead, verification?: VerificationResult) {
  if (lead.telegram) return "Telegram";
  if (lead.instagram || verification?.instagramUrl) return "Instagram";
  if (lead.vk || verification?.vkUrl) return "VK";
  return lead.contact_channel;
}

function formatCheckedAt(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });
}

function effectiveStage(lead: Lead, verification: VerificationResult | undefined, activity: LeadActivity | undefined) {
  if (activity?.status) return activity.status;
  if (!verification) return "Проверить";
  if (verification.exclude) return "Неактуально";
  if (["Подтверждено", "Вероятно работает"].includes(verification.status)) {
    return lead.direct_contact || verification.instagramUrl || verification.vkUrl ? "Писать сейчас" : "Найти ЛПР";
  }
  return "Проверить";
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
  const [stage, setStage] = useState("Все этапы");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState("");
  const [activity, setActivity] = useState<ActivityMap>({});
  const [verification, setVerification] = useState<VerificationMap>({});
  const [verifying, setVerifying] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("kava-mc-lead-activity-v1");
      if (stored) setActivity(JSON.parse(stored) as ActivityMap);
      const verified = window.localStorage.getItem("kava-mc-lead-verification-v2");
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
      const check = verification[lead.id];
      const actualStage = effectiveStage(lead, check, activity[lead.id]);
      const liveActuality = check?.status ?? lead.actuality_status;
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
          name: lead.name,
          city: lead.city,
          address: lead.address,
          amenity: lead.amenity,
          venue_segment: lead.venue_segment,
          website: lead.website,
          phone: lead.phone,
          email: lead.email,
          telegram: lead.telegram,
          vk: lead.vk,
          instagram: lead.instagram,
          yandex_maps_url: lead.yandex_maps_url,
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
          window.localStorage.setItem("kava-mc-lead-verification-v2", JSON.stringify(updated));
          return updated;
        });
      })
      .catch(() => {
        // Manual research links remain available if automatic research is temporarily blocked.
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

  const confirmedCount = Object.values(verification).filter((item) => item.status === "Подтверждено").length;

  if (loading) {
    return <main className={styles.loading}>Собираю кандидатов и проверяю, кто из них реально жив, а кто уже призрак из старой карточки.</main>;
  }

  if (error || !payload) {
    return <main className={styles.loading}>Не удалось загрузить базу: {error || "неизвестная ошибка"}</main>;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>KAVA MC MULTI-SOURCE SALES</p>
          <h1>Живые ночные площадки, а не свалка карточек</h1>
          <p className={styles.subtitle}>OpenStreetMap теперь только находит кандидатов. Перед продажей система ищет точное название по вебу, Яндекс Картам, 2ГИС, Instagram и VK, отсеивает закрытые места, ТЦ и неправильный формат.</p>
        </div>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="/api/venues/leads?focus=nightlife&format=csv">Скачать кандидатов</a>
          <a className={styles.secondaryButton} href="/api/venues/leads?all=true&format=csv">Скачать сырой массив</a>
        </div>
      </section>

      <section className={styles.stats}>
        <article><span>Кандидаты после фильтра</span><strong>{payload.stats.qualified.toLocaleString("ru-RU")}</strong></article>
        <article><span>Ночные клубы</span><strong>{payload.stats.nightclubs.toLocaleString("ru-RU")}</strong></article>
        <article><span>Рестобары / лаунжи</span><strong>{payload.stats.restobars.toLocaleString("ru-RU")}</strong></article>
        <article><span>Отсечено ТЦ и мусора</span><strong>{(payload.stats.rejectedFalsePositives ?? 0).toLocaleString("ru-RU")}</strong></article>
        <article><span>Подтверждено в интернете</span><strong>{confirmedCount.toLocaleString("ru-RU")}</strong></article>
      </section>

      <section className={styles.workflow}>
        <button className={stage === "Все этапы" ? styles.activeStage : ""} onClick={() => setStage("Все этапы")}>Все</button>
        <button className={stage === "Писать сейчас" ? styles.activeStage : ""} onClick={() => setStage("Писать сейчас")}>1. Писать сейчас</button>
        <button className={stage === "Найти ЛПР" ? styles.activeStage : ""} onClick={() => setStage("Найти ЛПР")}>2. Найти ЛПР</button>
        <button className={stage === "Проверить" ? styles.activeStage : ""} onClick={() => setStage("Проверить")}>3. Проверить</button>
        <button className={stage === "Неактуально" ? styles.activeStage : ""} onClick={() => setStage("Неактуально")}>Исключённые</button>
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
          {ACTUALITY_OPTIONS.map((option) => <option key={option}>{option}</option>)}
        </select>
      </section>

      <section className={styles.resultHeader}>
        <div><strong>{filtered.length.toLocaleString("ru-RU")}</strong> лидов в текущей выборке</div>
        <div>{verifying ? "Ищу площадки по вебу, Instagram, VK и каталогам..." : `Страница ${page} из ${pages}`}</div>
      </section>

      <section className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Приоритет</th>
              <th>Заведение</th>
              <th>Проверка</th>
              <th>Почему подходит</th>
              <th>Что продаём</th>
              <th>Контакт</th>
              <th>Этап</th>
              <th>Источники</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((lead) => {
              const check = verification[lead.id];
              const actualStatus = effectiveStage(lead, check, activity[lead.id]);
              const actualityStatus = check?.status ?? lead.actuality_status;
              const actualityReason = check?.reason ?? lead.actuality_reason;
              const checkedAt = check?.checkedAt ?? lead.actuality_checked_at;

              return (
                <tr key={lead.id}>
                  <td><span className={`${styles.priority} ${styles[`priority${lead.priority}`]}`}>{lead.priority}</span><small>{lead.score}</small></td>
                  <td>
                    <strong>{lead.name}</strong>
                    <span>{lead.venue_segment}{lead.city ? ` · ${lead.city}` : ""}</span>
                    <small>{lead.address || "Адрес требует проверки"}</small>
                    {lead.opening_hours && <small>График: {lead.opening_hours}</small>}
                  </td>
                  <td>
                    <strong>{actualityStatus}</strong>
                    <span>{actualityReason}</span>
                    {check && <small>Независимых источников: {check.evidenceCount}</small>}
                    {checkedAt && <small>Проверено: {formatCheckedAt(checkedAt)}</small>}
                  </td>
                  <td><p>{lead.reason}</p><small>Ищем: {lead.decision_maker}</small></td>
                  <td><strong>{lead.product}</strong><span>{lead.price}</span></td>
                  <td>
                    <a className={styles.contactLink} href={contactHref(lead, check)} target="_blank" rel="noreferrer">{contactLabel(lead, check)}</a>
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
                    {!check?.exclude && ["Подтверждено", "Вероятно работает"].includes(check?.status ?? "") && (
                      <button className={styles.copyButton} onClick={() => copyMessage(lead)}>{copiedId === lead.id ? "Скопировано" : "Скопировать заход"}</button>
                    )}
                  </td>
                  <td>
                    {check?.sourceLinks?.slice(0, 6).map((source) => (
                      <a key={source.url} className={styles.sourceLink} href={source.url} target="_blank" rel="noreferrer" title={source.snippet}>{source.label}</a>
                    ))}
                    <a className={styles.sourceLink} href={lead.yandex_maps_url} target="_blank" rel="noreferrer">Яндекс Карты</a>
                    <a className={styles.sourceLink} href={lead.two_gis_url} target="_blank" rel="noreferrer">2ГИС</a>
                    <a className={styles.sourceLink} href={lead.google_search_url} target="_blank" rel="noreferrer">Поиск в интернете</a>
                    <a className={styles.sourceLink} href={lead.instagram_search_url} target="_blank" rel="noreferrer">Найти Instagram</a>
                    <a className={styles.sourceLink} href={lead.vk_search_url} target="_blank" rel="noreferrer">Найти VK</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {visible.length === 0 && <div className={styles.empty}>По этим фильтрам ничего нет. Возможно, интернет-проверка уже вынесла мусор за дверь.</div>}

      <section className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Назад</button>
        <span>{page} / {pages}</span>
        <button disabled={page === pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}>Дальше</button>
      </section>

      <section className={styles.rules}>
        <h2>Как теперь принимается решение</h2>
        <div>
          <p><strong>Одна карта ничего не доказывает.</strong> OpenStreetMap используется только как стартовый список кандидатов.</p>
          <p><strong>Нужно несколько источников.</strong> Система ищет официальный сайт, каталоги, Instagram, VK и обычные веб-упоминания.</p>
          <p><strong>Мусор исключается автоматически.</strong> Закрытые заведения, ТЦ, БЦ и неподходящий формат уходят в раздел «Исключённые».</p>
        </div>
      </section>

      <footer className={styles.footer}>
        Автоматический поиск использует открытые веб-страницы и поисковую выдачу. Instagram иногда закрывает данные от автоматических систем, поэтому для каждого лида дополнительно оставлена отдельная кнопка поиска профиля.
      </footer>
    </main>
  );
}
