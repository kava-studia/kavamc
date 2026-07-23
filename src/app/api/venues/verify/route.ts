import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type VerifyInput = {
  id: string;
  name?: string;
  city?: string;
  address?: string;
  amenity?: string;
  venue_segment?: string;
  website?: string;
  phone?: string;
  email?: string;
  telegram?: string;
  vk?: string;
  instagram?: string;
};

type SearchResult = { title: string; url: string; snippet: string };
type SourceKind = "website" | "instagram" | "vk" | "maps" | "directory" | "web";
type SourceLink = { label: string; url: string; kind: SourceKind; snippet: string };

type WebsiteCheck = {
  reachable: boolean;
  status: number | null;
  finalUrl: string;
  error: string;
  text: string;
};

const STRONG_TYPES = new Set(["nightclub", "music_venue", "music_club", "dance_venue", "karaoke_box", "bar", "pub", "biergarten"]);
const NIGHT_WORDS = [
  "ночной клуб", "nightclub", "music club", "dance club", "караоке", "karaoke", "ресто-бар",
  "рестобар", "gastrobar", "гастробар", "lounge", "лаунж", "бар", "pub", "паб", "dj",
  "диджей", "вечерин", "afterparty", "концерт", "живая музыка", "live music", "танцпол", "шоу-программа",
];
const MALL_WORDS = [
  "торговый центр", "торгово-развлекательный центр", "торгово развлекательный центр", "торговый комплекс",
  "трц", "shopping mall", "business center", "бизнес-центр", "бизнес центр", "рынок", "универмаг", "гипермаркет",
];
const CLOSED_WORDS = [
  "закрыто навсегда", "закрылся навсегда", "закрылись навсегда", "больше не работает", "прекратил работу",
  "прекратило работу", "прекратили работу", "ликвидирован", "ликвидировано", "заведение закрыто",
  "ресторан закрыт", "клуб закрыт", "бар закрыт", "караоке закрыто", "permanently closed", "closed permanently",
];
const STOP_WORDS = new Set(["бар", "клуб", "кафе", "ресторан", "караоке", "паб", "лаунж", "the", "club", "bar", "restaurant", "lounge"]);

function normalise(value: string) {
  return value.toLowerCase().replace(/ё/g, "е").replace(/&quot;|&#34;/g, '"').replace(/[^a-zа-я0-9@._:/\- ]+/gi, " ").replace(/\s+/g, " ").trim();
}

function hasAny(value: string, words: string[]) {
  const corpus = normalise(value);
  return words.some((word) => corpus.includes(normalise(word)));
}

function safeWebsite(value: string) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function socialUrl(value: string, network: "instagram" | "vk") {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const clean = value.replace(/^@/, "").replace(/^\/+|\/+$/g, "");
  return network === "instagram" ? `https://www.instagram.com/${clean}/` : `https://vk.com/${clean}`;
}

function unsafeHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local")) return true;
  if (/^(127|10|192\.168|169\.254)\./.test(host)) return true;
  const private172 = host.match(/^172\.(\d+)\./);
  return Boolean(private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31)
    || host === "::1" || host.startsWith("fc") || host.startsWith("fd");
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
}

function stripTags(value: string) {
  return normalise(decodeXml(value).replace(/<[^>]+>/g, " "));
}

function xmlTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]).trim() : "";
}

function parseRss(xml: string) {
  return (xml.match(/<item>[\s\S]*?<\/item>/gi) ?? []).map((item) => ({
    title: stripTags(xmlTag(item, "title")),
    url: stripTags(xmlTag(item, "link")),
    snippet: stripTags(xmlTag(item, "description")),
  })).filter((item) => item.title && /^https?:\/\//i.test(item.url)).slice(0, 10);
}

async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`https://www.bing.com/search?format=rss&setlang=ru-RU&q=${encodeURIComponent(query)}`, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; KAVA-MC-Venue-Research/2.1)", Accept: "application/rss+xml, application/xml, text/xml" },
      signal: AbortSignal.timeout(8_000),
    });
    return response.ok ? parseRss(await response.text()) : [];
  } catch {
    return [];
  }
}

async function checkWebsite(rawUrl: string): Promise<WebsiteCheck> {
  const website = safeWebsite(rawUrl);
  if (!website) return { reachable: false, status: null, finalUrl: "", error: "Сайт не указан", text: "" };
  try {
    const url = new URL(website);
    if (!["http:", "https:"].includes(url.protocol) || unsafeHost(url.hostname)) {
      return { reachable: false, status: null, finalUrl: website, error: "Небезопасный адрес", text: "" };
    }
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; KAVA-MC-Venue-Check/2.1)", Accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(7_000),
    });
    return {
      reachable: response.status >= 200 && response.status < 400,
      status: response.status,
      finalUrl: response.url || website,
      error: "",
      text: stripTags((await response.text()).slice(0, 250_000)),
    };
  } catch (error) {
    return { reachable: false, status: null, finalUrl: website, error: error instanceof Error ? error.message : "Ошибка проверки", text: "" };
  }
}

function hostOf(value: string) {
  try { return new URL(value).hostname.toLowerCase().replace(/^www\./, ""); } catch { return ""; }
}

function sourceKind(url: string): SourceKind {
  const host = hostOf(url);
  if (host.includes("instagram.com")) return "instagram";
  if (host === "vk.com" || host.endsWith(".vk.com")) return "vk";
  if (host.includes("yandex.") && url.includes("/maps")) return "maps";
  if (host.includes("2gis.")) return "directory";
  return "web";
}

function sourceLabel(kind: SourceKind, host: string) {
  if (kind === "instagram") return "Instagram";
  if (kind === "vk") return "VK";
  if (kind === "maps") return "Яндекс Карты";
  if (kind === "directory") return "2ГИС";
  if (kind === "website") return "Официальный сайт";
  return host || "Веб-источник";
}

function nameTokens(name: string) {
  return normalise(name).split(" ").filter((token) => token.length >= 3 && !STOP_WORDS.has(token)).slice(0, 5);
}

function relevant(lead: VerifyInput, result: SearchResult) {
  const corpus = normalise(`${result.title} ${result.snippet} ${result.url}`);
  const tokens = nameTokens(lead.name ?? "");
  if (tokens.length === 0) return true;
  return tokens.filter((token) => corpus.includes(token)).length >= Math.min(2, tokens.length);
}

function dedupe(sources: SourceLink[]) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = source.url.replace(/\/$/, "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function verifyLead(lead: VerifyInput) {
  const name = (lead.name ?? "").trim();
  const city = (lead.city ?? "").trim();
  const base = [`"${name}"`, city ? `"${city}"` : ""].filter(Boolean).join(" ");
  const [website, general, social] = await Promise.all([
    checkWebsite(lead.website ?? ""),
    name ? searchWeb(`${base} адрес телефон отзывы бар клуб караоке ресторан`) : Promise.resolve([]),
    name ? searchWeb(`${base} site:instagram.com OR site:vk.com`) : Promise.resolve([]),
  ]);
  const results = [...general, ...social].filter((item) => relevant(lead, item));
  const sources: SourceLink[] = [];

  if (website.reachable && website.finalUrl) {
    sources.push({ label: "Официальный сайт", url: website.finalUrl, kind: "website", snippet: `Сайт отвечает кодом ${website.status}` });
  }
  const directInstagram = socialUrl(lead.instagram ?? "", "instagram");
  const directVk = socialUrl(lead.vk ?? "", "vk");
  if (directInstagram) sources.push({ label: "Instagram", url: directInstagram, kind: "instagram", snippet: "Ссылка указана в исходной карточке" });
  if (directVk) sources.push({ label: "VK", url: directVk, kind: "vk", snippet: "Ссылка указана в исходной карточке" });

  for (const result of results) {
    const kind = sourceKind(result.url);
    sources.push({ label: sourceLabel(kind, hostOf(result.url)), url: result.url, kind, snippet: result.snippet || result.title });
  }

  const uniqueSources = dedupe(sources).slice(0, 10);
  const evidenceDomains = new Set(uniqueSources.map((source) => hostOf(source.url)).filter(Boolean));
  const resultText = results.map((item) => `${item.title} ${item.snippet}`).join(" ");
  const combinedText = `${lead.name ?? ""} ${lead.address ?? ""} ${lead.venue_segment ?? ""} ${resultText}`;
  const closedDomains = new Set(results.filter((item) => hasAny(`${item.title} ${item.snippet}`, CLOSED_WORDS)).map((item) => hostOf(item.url)).filter(Boolean));
  const websiteClosed = website.text ? hasAny(website.text, CLOSED_WORDS) : false;
  const looksLikeMall = hasAny(combinedText, MALL_WORDS) || /^(тц|трц|тк|бц)(\s|$|[«"'])/.test(normalise(lead.name ?? ""));
  const nightlifeEvidence = STRONG_TYPES.has(lead.amenity ?? "") || hasAny(combinedText, NIGHT_WORDS);
  const instagramUrl = uniqueSources.find((source) => source.kind === "instagram")?.url ?? "";
  const vkUrl = uniqueSources.find((source) => source.kind === "vk")?.url ?? "";
  const evidenceCount = evidenceDomains.size;

  let status = "Нужна ручная проверка";
  let reason = "Автоматическое подтверждение не найдено. Проверь Яндекс Карты, 2ГИС, Instagram и VK перед сообщением.";
  let confidence: "high" | "medium" | "low" = "low";
  let exclude = false;

  if (websiteClosed || closedDomains.size >= 2) {
    status = "Закрыто / исключить";
    reason = "В официальном сайте или нескольких независимых источниках найдены признаки окончательного закрытия. Не писать.";
    confidence = websiteClosed && closedDomains.size > 0 ? "high" : "medium";
    exclude = true;
  } else if (looksLikeMall) {
    status = "Не тот формат";
    reason = "В поисковой выдаче объект определяется как ТЦ, БЦ, рынок или торговый комплекс, а не самостоятельная ночная площадка.";
    confidence = "high";
    exclude = true;
  } else if (!nightlifeEvidence && evidenceCount >= 2) {
    status = "Не тот формат";
    reason = "Источники подтверждают объект, но не подтверждают клубный, барный, караоке или вечерний формат.";
    confidence = "medium";
    exclude = true;
  } else if (nightlifeEvidence && evidenceCount >= 3) {
    status = "Подтверждено";
    reason = `Найдено ${evidenceCount} независимых источника: ${uniqueSources.slice(0, 4).map((source) => source.label).join(", ")}. Формат ночной площадки подтверждён.`;
    confidence = "high";
  } else if (nightlifeEvidence && evidenceCount >= 2) {
    status = "Вероятно работает";
    reason = `Найдено ${evidenceCount} источника: ${uniqueSources.slice(0, 3).map((source) => source.label).join(", ")}. Перед сообщением проверь свежую афишу или публикации.`;
    confidence = "medium";
  } else if (website.reachable && nightlifeEvidence) {
    status = "Вероятно работает";
    reason = "Официальный сайт отвечает и формат выглядит подходящим, но второго независимого подтверждения пока нет.";
  }

  return {
    id: lead.id,
    status,
    reason,
    confidence,
    exclude,
    evidenceCount,
    checkedAt: new Date().toISOString(),
    websiteReachable: website.reachable,
    websiteStatus: website.status,
    websiteFinalUrl: website.finalUrl,
    websiteError: website.error,
    instagramUrl,
    vkUrl,
    sourceLinks: uniqueSources,
  };
}

async function mapLimit<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { leads?: VerifyInput[] };
    const leads = Array.isArray(body.leads) ? body.leads.slice(0, 20) : [];
    const results = await mapLimit(leads, 5, verifyLead);
    return NextResponse.json({ checkedAt: new Date().toISOString(), count: results.length, results }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({
      error: "Не удалось проверить актуальность заведений",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
}
