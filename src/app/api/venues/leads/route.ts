import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type RawVenue = {
  osm_type: string;
  osm_id: number;
  name: string;
  amenity: string;
  city: string;
  district: string;
  street: string;
  house_number: string;
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
  description: string;
  latitude: number | string;
  longitude: number | string;
  osm_url: string;
};

type Lead = RawVenue & {
  id: string;
  score: number;
  priority: "A" | "B" | "C";
  priority_label: string;
  qualified: boolean;
  direct_contact: boolean;
  contact_channel: string;
  product: string;
  price: string;
  reason: string;
  decision_maker: string;
  pipeline_status: string;
  next_step: string;
  source: string;
};

const HIGH_INTENT = [
  "караоке", "karaoke", "клуб", "club", "lounge", "лаунж", "restobar", "ресто-бар",
  "gastrobar", "гастробар", "pub", "паб", "bar", "бар", "banquet", "банкет",
  "event", "ивент", "music", "музык", "live", "grill", "гриль", "rooftop", "терраса",
];

const EVENT_WORDS = ["банкет", "свадеб", "event", "ивент", "торжеств", "праздник", "усадьба", "шале"];

const JUNK_WORDS = [
  "столовая", "буфет", "магазин", "алкомаркет", "разливное", "пивной магазин", "кофе с собой",
  "шаурма", "донер", "фудкорт", "доставка", "суши wok", "суши вок", "пицца экспресс",
  "вкусно — и точка", "вкусно и точка", "burger king", "бургер кинг", "rostic", "kfc",
  "додо пицца", "subway", "теремок", "крошка картошка", "coffee like", "one price coffee",
];

function text(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ").toLowerCase().replace(/ё/g, "е");
}

function hasAny(haystack: string, words: string[]) {
  return words.some((word) => haystack.includes(word));
}

function directContact(v: RawVenue) {
  return Boolean(v.phone || v.email || v.telegram || v.vk || v.instagram);
}

function contactChannel(v: RawVenue) {
  if (v.telegram) return "Telegram";
  if (v.vk) return "VK";
  if (v.instagram) return "Instagram";
  if (v.email) return "Email";
  if (v.phone) return "Телефон";
  if (v.website) return "Сайт";
  return "Искать контакт";
}

function scoreVenue(v: RawVenue) {
  const corpus = text(v.name, v.description, v.cuisine);
  let score = 0;

  switch (v.amenity) {
    case "nightclub": score += 105; break;
    case "events_venue": score += 100; break;
    case "bar": score += 90; break;
    case "pub": score += 86; break;
    case "biergarten": score += 80; break;
    case "restaurant": score += 48; break;
    default: score += 25;
  }

  if (directContact(v)) score += 18;
  if (v.telegram || v.vk || v.instagram) score += 8;
  if (v.website) score += 6;
  if (v.capacity && Number(v.capacity) >= 50) score += 8;
  if (hasAny(corpus, HIGH_INTENT)) score += 24;
  if (hasAny(corpus, EVENT_WORDS)) score += 18;
  if (/24:00|00:00|01:00|02:00|03:00|04:00|05:00/.test(v.opening_hours || "")) score += 8;
  if (!v.city) score -= 4;
  if (!v.name) score -= 200;
  if (hasAny(corpus, JUNK_WORDS)) score -= 180;

  return score;
}

function productFor(v: RawVenue) {
  const corpus = text(v.name, v.description);
  if (v.amenity === "events_venue" || hasAny(corpus, EVENT_WORDS)) {
    return { product: "KAVA MC + Live Guitar / банкет", price: "от 30 000 ₽ + трансфер" };
  }
  if (["nightclub", "bar", "pub", "biergarten"].includes(v.amenity) || hasAny(corpus, HIGH_INTENT)) {
    return { product: "KAVA MC Club Set", price: "15 000 ₽ + трансфер" };
  }
  return { product: "Гостевая пятница / суббота с KAVA MC", price: "15 000 ₽ + трансфер" };
}

function reasonFor(v: RawVenue) {
  const corpus = text(v.name, v.description);
  if (v.amenity === "nightclub") return "Ночной формат - MC усиливает DJ-сет, контакт с залом и динамику вечера";
  if (v.amenity === "events_venue" || hasAny(corpus, EVENT_WORDS)) return "Площадке можно продавать готовый банкетный формат с ведущим и live-элементом";
  if (v.amenity === "bar" || v.amenity === "pub" || v.amenity === "biergarten") return "Барный формат подходит под гостевую пятницу, тематическую вечеринку или регулярную резиденцию";
  if (hasAny(corpus, ["караоке", "karaoke"])) return "Караоке-аудитории нужен ведущий, который держит темп, вовлекает гостей и поддерживает DJ";
  if (hasAny(corpus, ["lounge", "лаунж", "restobar", "ресто-бар", "gastrobar", "гастробар"])) return "Заведение можно усилить вечерней программой без превращения ресторана в конкурсный ад";
  return "Ресторану можно предложить тестовую пятницу, банкетные даты и регулярные вечерние программы";
}

function decisionMakerFor(v: RawVenue) {
  if (["nightclub", "bar", "pub", "biergarten"].includes(v.amenity)) return "Управляющий / арт-директор / booking";
  if (v.amenity === "events_venue") return "Управляющий / банкетный менеджер / собственник";
  return "Управляющий / банкетный менеджер / маркетолог";
}

function toLead(v: RawVenue): Lead {
  const score = scoreVenue(v);
  const direct = directContact(v);
  const reachable = direct || Boolean(v.website);
  const priority: Lead["priority"] = score >= 105 ? "A" : score >= 78 ? "B" : "C";
  const labels = { A: "Высокий", B: "Средний", C: "На проверку" } as const;
  const offer = productFor(v);
  const pipelineStatus = direct ? "Писать сейчас" : v.website ? "Найти ЛПР" : "Проверить";

  return {
    ...v,
    id: `${v.osm_type}-${v.osm_id}`,
    score,
    priority,
    priority_label: labels[priority],
    qualified: Boolean(v.name) && score >= 58,
    direct_contact: direct,
    contact_channel: contactChannel(v),
    product: offer.product,
    price: offer.price,
    reason: reasonFor(v),
    decision_maker: decisionMakerFor(v),
    pipeline_status: pipelineStatus,
    next_step: pipelineStatus === "Писать сейчас"
      ? "Отправить персональное сообщение и назначить повтор через 3 дня"
      : pipelineStatus === "Найти ЛПР"
        ? "Открыть сайт, найти управляющего или booking и добавить прямой контакт"
        : "Проверить актуальность, афишу, соцсети и вечерний формат",
    source: "OpenStreetMap contributors",
  };
}

function csvEscape(value: unknown) {
  const result = String(value ?? "");
  return /[;"\n\r]/.test(result) ? `"${result.replace(/"/g, '""')}"` : result;
}

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get("all") === "true";
    const format = request.nextUrl.searchParams.get("format") === "csv" ? "csv" : "json";
    const rawUrl = new URL("/api/venues?includeCafe=false", request.nextUrl.origin);
    const rawResponse = await fetch(rawUrl, { cache: "no-store", signal: AbortSignal.timeout(58_000) });

    if (!rawResponse.ok) {
      return NextResponse.json({ error: "Не удалось загрузить исходную базу", status: rawResponse.status }, { status: 502 });
    }

    const payload = await rawResponse.json() as { generatedAt?: string; venues?: RawVenue[] };
    const leads = (payload.venues ?? [])
      .map(toLead)
      .filter((lead) => all || lead.qualified)
      .sort((a, b) => b.score - a.score || a.city.localeCompare(b.city, "ru") || a.name.localeCompare(b.name, "ru"));

    const stats = {
      raw: payload.venues?.length ?? 0,
      qualified: leads.filter((lead) => lead.qualified).length,
      highPriority: leads.filter((lead) => lead.priority === "A").length,
      directContact: leads.filter((lead) => lead.direct_contact).length,
      writeNow: leads.filter((lead) => lead.pipeline_status === "Писать сейчас").length,
      findDecisionMaker: leads.filter((lead) => lead.pipeline_status === "Найти ЛПР").length,
      research: leads.filter((lead) => lead.pipeline_status === "Проверить").length,
    };

    if (format === "csv") {
      const headers: Array<keyof Lead> = [
        "id", "name", "amenity", "city", "address", "phone", "email", "telegram", "vk", "instagram",
        "website", "opening_hours", "cuisine", "capacity", "priority", "priority_label", "score", "direct_contact",
        "contact_channel", "product", "price", "reason", "decision_maker", "pipeline_status", "next_step",
        "latitude", "longitude", "osm_url", "source",
      ];
      const csv = [headers.join(";"), ...leads.map((lead) => headers.map((header) => csvEscape(lead[header])).join(";"))].join("\n");
      return new NextResponse(`\uFEFF${csv}`, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=kava-mc-moscow-oblast-leads-${new Date().toISOString().slice(0, 10)}.csv`,
          "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
          "X-Leads-Count": String(leads.length),
        },
      });
    }

    return NextResponse.json({
      generatedAt: payload.generatedAt ?? new Date().toISOString(),
      source: "OpenStreetMap contributors via Overpass API",
      area: "Московская область",
      stats,
      leads,
    }, {
      headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    return NextResponse.json({
      error: "Не удалось собрать квалифицированную базу лидов",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 502 });
  }
}
