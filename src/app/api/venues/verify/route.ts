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
  yandex_maps_url?: string;
};

type WebsiteCheck = {
  reachable: boolean;
  status: number | null;
  finalUrl: string;
  error: string;
  text: string;
};

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

type SourceLink = {
  label: string;
  url: string;
  kind: "website" | "instagram" | "vk" | "maps" | "directory" | "web";
  snippet: string;
};

const STRONG_NIGHTLIFE_TYPES = new Set([
  "nightclub",
  "music_venue",
  "music_club",
  "dance_venue",
  "karaoke_box",
  "bar",
  "pub",
  "biergarten",
]);

const NIGHTLIFE_WORDS = [
  "ночной клуб", "nightclub", "music club", "dance club", "караоке", "karaoke",
  "ресто-бар", "рестобар", "gastrobar", "гастробар", "lounge", "лаунж",
  "бар", "pub", "паб", "dj", "диджей", "вечерин", "afterparty", "концерт",
  "живая музыка", "live music", "танцпол", "шоу-программа",
];

const MALL_WORDS = [
  "торговый центр", "торгово-развлекательный центр", "торгово развлекательный центр",
  "торговый комплекс", "трц", "тк ", "тц ", "shopping mall", "business center",
  "бизнес-центр", "бизнес центр", "рынок", "универмаг", "гипермаркет",
];

const CLOSED_WORDS = [
  "закрыто навсегда", "закрылся навсегда", "закрылись навсегда", "больше не работает",
  "прекратил работу", "прекратило работу", "прекратили работу", "ликвидирован",
  "ликвидировано", "заведение закрыто", "ресторан закрыт", "клуб закрыт",
  "бар закрыт", "караоке закрыто", "permanently closed", "closed permanently",
];

const STOP_WORDS = new Set([
  "бар", "клуб", "кафе", "ресторан", "караоке", "паб", "лаунж", "the", "club",
  "bar", "restaurant", "lounge", "московская", "область",
]);

function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/[^a-zа-я0-9@._:/\- ]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(text: string, words: string[]) {
  const haystack = normalise(text);
  return words.some((word) => haystack.includes(normalise(word)));
}

function normaliseWebsite(value: string) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function normaliseSocial(value: string, network: "instagram" | "vk") {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const clean = value.replace(/^@/, "").replace(/^\/+|\/+$/g, "");
  return network === "instagram" ? `https://www.instagram.com/${clean}/` : `https://vk.com/${clean}`;
}

function isUnsafeHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local")) return true;
  if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host)) return true;
  if (/^169\.254\./.test(host)) return true;
  const match = host.match(/^172\.(\d+)\./);
  if (match && Number(match[1]) >= 16 && Number(match[1]) <= 31) return true;
  if (host === "::1" || host.startsWith("fc") || host.startsWith("fd")) return true;
  return false;
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
}

function stripTags(value: string) {
  return normalise(decodeXml(value).replace(/<[^>]+>/g, " "));
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]).trim() : "";
}

function parseBingRss(xml: string): SearchResult[] {
  const results: SearchResult[] = [];
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];

  for (const item of items) {
    const title = stripTags(extractTag(item, "title"));
    const url = stripTags(extractTag(item, "link"));
    const snippet = stripTags(extractTag(item, "description"));
    if (title && /^https?:\/\//i.test(url)) results.push({ title, url, snippet });
  }

  return results;
}

async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    const url = `https://www.bing.com/search?format=rss&setlang=ru-RU&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KAVA-MC-Venue-Research/2.0)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) return [];
    return parseBingRss(await response.text()).slice(0, 10);
  } catch {
    return [];
  }
}

async function fetchWebsite(rawUrl: string): Promise<WebsiteCheck> {
  const website = normaliseWebsite(rawUrl);
  if (!website) return { reachable: false, status: null, finalUrl: "", error: "Сайт не указан", text: "" };

  try {
    const url = new URL(website);
    if (!["http:", "https:"].includes(url.protocol) || isUnsafeHost(url.hostname)) {
      return { reachable: false, status: null, finalUrl: website, error: "Небезопасный адрес", text: "" };
    }

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KAVA-MC-Venue-Check/2.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(7_000),
    });

    const body = (await response.text()).slice(0, 250_000);
    return {
      reachable: response.status >= 200 && response.status < 400,
      status: response.status,
      finalUrl: response.url || website,
      error: "",
      text: stripTags(body),
    };
  } catch (error) {
    return {
      reachable: false,
      status: null,
      finalUrl: website,
      error: error instanceof Error ? error.message : "Ошибка проверки",
      text: "",
    };
  }
}

function hostOf(value: string) {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function kindFor(url: string): SourceLink["kind"] {
  const host = hostOf(url);
  if (host.includes("instagram.com")) return "instagram";
  if (host === "vk.com" || host.endsWith(".vk.com")) return "vk";
  if (host.includes("yandex.") && url.includes("/maps")) return "maps";
  if (host.includes("2gis.")) return "directory";
  return "web";
}

function significantTokens(name: string) {
  return normalise(name)
    .split(" ")
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token))
    .slice(0, 5);
}

function isRelevantResult(lead: VerifyInput, result: SearchResult) {
  const corpus = normalise(`${result.title} ${result.snippet} ${result.url}`);
  const tokens = significantTokens(lead.name ?? "");
  if (tokens.length === 0) return true;
  const matched = tokens.filter((token) => corpus.includes(token)).length;
  return matched >= Math.min(2, tokens.length);
}

function dedupeSources(sources: SourceLink[]) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = source.url.replace(/\/$/, "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function labelFor(kind: SourceLink["kind"], host: string) {
  if (kind === "instagram") return "Instagram";
  if (kind === "vk") return "VK";
  if (kind === "maps") return "Яндекс Карты";
  if (kind === "directory") return "2ГИС";
  if (kind === "website") return "Официальный сайт";
  return host || "Веб-источник";
}

async function mapLimit<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

async function resolveLeadMap(request: NextRequest) {
  try {
    const response = await fetch(new URL("/api/venues/leads?focus=nightlife", request.nextUrl.origin), {
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return new Map<string, VerifyInput>();
    const payload = await response.json() as { leads?: VerifyInput[] };
    return new Map((payload.leads ?? []).map((lead) => [lead.id, lead]));
  } catch {
    return new Map<string, VerifyInput>();
  }
}

async function verifyLead(lead: VerifyInput) {
  const name = (lead.name ?? "").trim();
  const city = (lead.city ?? "").trim();
  const queryBase = [`"${name}"`, city ? `"${city}"` : ""].filter(Boolean).join(" ");
  const generalQuery = `${queryBase} адрес телефон отзывы бар клуб караоке ресторан`;
  const socialQuery = `${queryBase} site:instagram.com OR site:vk.com`;

  const [website, generalResults, socialResults] = await Promise.all([
    fetchWebsite(lead.website ?? ""),
    name ? searchWeb(generalQuery) : Promise.resolve([]),
    name ? searchWeb(socialQuery) : Promise.resolve([]),
  ]);

  const relevantResults = [...generalResults, ...socialResults]
    .filter((result) => isRelevantResult(lead, result));

  const sources: SourceLink[] = [];
  if (website.reachable && website.finalUrl) {
    sources.push({
      label: "Официальный сайт",
      url: website.finalUrl,
      kind: "website",
      snippet: `Сайт отвечает кодом ${website.status}`,
    });
  }

  const directInstagram = normaliseSocial(lead.instagram ?? "", "instagram");
  const directVk = normaliseSocial(lead.vk ?? "", "vk");
  if (directInstagram) sources.push({ label: "Instagram", url: directInstagram, kind: "instagram", snippet: "Ссылка указана в исходной карточке" });
  if (directVk) sources.push({ label: "VK", url: directVk, kind: "vk", snippet: "Ссылка указана в исходной карточке" });

  for (const result of relevantResults) {
    const kind = kindFor(result.url);
    const host = hostOf(result.url);
    sources.push({
      label: labelFor(kind, host),
      url: result.url,
      kind,
      snippet: result.snippet || result.title,
    });
  }

  const uniqueSources = dedupeSources(sources).slice(0, 10);
  const sourceDomains = new Set(uniqueSources.map((source) => hostOf(source.url)).filter(Boolean));
  const combinedSearchText = relevantResults.map((result) => `${result.title} ${result.snippet}`).join(" ");
  const combinedText = `${lead.name ?? ""} ${lead.address ?? ""} ${lead.venue_segment ?? ""} ${combinedSearchText}`;
  const websiteClosed = website.text ? hasAny(website.text, CLOSED_WORDS) : false;
  const closedDomains = new Set(
    relevantResults
      .filter((result) => hasAny(`${result.title} ${result.snippet}`, CLOSED_WORDS))
      .map((result) => hostOf(result.url))
      .filter(Boolean),
  );

  const looksLikeMall = hasAny(`${lead.name ?? ""} ${lead.address ?? ""}`, MALL_WORDS);
  const strongType = STRONG_NIGHTLIFE_TYPES.has(lead.amenity ?? "");
  const nightlifeEvidence = strongType || hasAny(combinedText, NIGHTLIFE_WORDS);
  const instagramSource = uniqueSources.find((source) => source.kind === "instagram")?.url ?? "";
  const vkSource = uniqueSources.find((source) => source.kind === "vk")?.url ?? "";
  const evidenceCount = sourceDomains.size;

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
    reason = "По названию или адресу это ТЦ, БЦ либо торговый объект, а не самостоятельная ночная площадка.";
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
    confidence = "low";
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
    instagramUrl: instagramSource,
    vkUrl: vkSource,
    sourceLinks: uniqueSources,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { leads?: VerifyInput[] };
    const incoming = Array.isArray(body.leads) ? body.leads.slice(0, 20) : [];
    const leadMap = await resolveLeadMap(request);
    const leads = incoming.map((lead) => ({ ...leadMap.get(lead.id), ...lead }));
    const results = await mapLimit(leads, 5, verifyLead);

    return NextResponse.json({
      checkedAt: new Date().toISOString(),
      count: results.length,
      results,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({
      error: "Не удалось проверить актуальность заведений",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
}
