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
  osm_updated_at: string;
  yandex_maps_url: string;
  osm_url: string;
};

type ActualityStatus = "Свежие данные" | "Вероятно актуально" | "Проверить вручную";

type Lead = RawVenue & {
  id: string;
  score: number;
  nightlife_score: number;
  priority: "A" | "B" | "C";
  priority_label: string;
  qualified: boolean;
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
  actuality_status: ActualityStatus;
  actuality_reason: string;
  actuality_checked_at: string;
  source: string;
};

const NIGHTLIFE_TYPES = [
  "nightclub",
  "music_venue",
  "music_club",
  "dance_venue",
  "karaoke_box",
  "bar",
  "pub",
  "biergarten",
];

const NIGHTLIFE_WORDS = [
  "ночной", "night", "клуб", "club", "dance", "dj", "диджей", "music", "музык",
  "караоке", "karaoke", "lounge", "лаунж", "restobar", "ресто-бар", "рестобар",
  "gastrobar", "гастробар", "pub", "паб", "bar", "бар", "afterparty", "вечерин",
  "live", "концерт", "rooftop", "терраса", "hookah", "кальян",
];

const RESTOBAR_WORDS = [
  "restobar", "ресто-бар", "рестобар", "gastrobar", "гастробар", "lounge", "лаунж",
  "grill bar", "гриль бар", "music bar", "караоке", "karaoke",
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

function isLate(v: RawVenue) {
  const hours = v.opening_hours || "";
  return /24:00|00:00|00:30|01:00|01:30|02:00|02:30|03:00|04:00|05:00|06:00/.test(hours)
    || /24\/7/i.test(hours);
}

function segmentFor(v: RawVenue) {
  const corpus = text(v.name, v.description, v.cuisine);
  if (["nightclub", "music_club", "dance_venue"].includes(v.amenity)) return "Ночной клуб";
  if (v.amenity === "music_venue") return "Музыкальная площадка";
  if (v.amenity === "karaoke_box" || hasAny(corpus, ["караоке", "karaoke"])) return "Караоке";
  if (hasAny(corpus, RESTOBAR_WORDS)) return "Рестобар / лаунж";
  if (["bar", "pub", "biergarten"].includes(v.amenity)) return "Бар / паб";
  if (v.amenity === "events_venue") return "Event-площадка";
  if (v.amenity === "restaurant" && (isLate(v) || hasAny(corpus, NIGHTLIFE_WORDS))) return "Ресторан с вечерним форматом";
  return "Обычный ресторан";
}

function nightlifeRelevant(v: RawVenue) {
  const corpus = text(v.name, v.description, v.cuisine);
  return NIGHTLIFE_TYPES.includes(v.amenity)
    || hasAny(corpus, NIGHTLIFE_WORDS)
    || (v.amenity === "restaurant" && isLate(v));
}

function nightlifeScore(v: RawVenue) {
  const corpus = text(v.name, v.description, v.cuisine);
  let score = 0;

  switch (v.amenity) {
    case "nightclub": score += 125; break;
    case "music_club": score += 120; break;
    case "dance_venue": score += 116; break;
    case "music_venue": score += 112; break;
    case "karaoke_box": score += 108; break;
    case "bar": score += 96; break;
    case "pub": score += 92; break;
    case "biergarten": score += 84; break;
    case "events_venue": score += 72; break;
    case "restaurant": score += 38; break;
    default: score += 20;
  }

  if (hasAny(corpus, RESTOBAR_WORDS)) score += 38;
  if (hasAny(corpus, ["ночной", "night", "club", "клуб", "dance", "dj", "диджей"])) score += 30;
  if (hasAny(corpus, ["караоке", "karaoke"])) score += 28;
  if (hasAny(corpus, ["live", "music", "музык", "концерт", "вечерин"])) score += 22;
  if (isLate(v)) score += 22;
  if (directContact(v)) score += 18;
  if (v.telegram || v.vk || v.instagram) score += 8;
  if (v.website) score += 6;
  if (v.capacity && Number(v.capacity) >= 50) score += 8;
  if (hasAny(corpus, EVENT_WORDS)) score += 10;
  if (!v.city) score -= 4;
  if (!v.name) score -= 220;
  if (hasAny(corpus, JUNK_WORDS)) score -= 200;

  return score;
}

function actualityFor(v: RawVenue): { status: ActualityStatus; reason: string } {
  const direct = directContact(v);
  const updatedAt = v.osm_updated_at ? new Date(v.osm_updated_at) : null;
  const validDate = updatedAt && !Number.isNaN(updatedAt.getTime()) ? updatedAt : null;
  const ageDays = validDate ? Math.floor((Date.now() - validDate.getTime()) / 86_400_000) : null;

  if (ageDays !== null && ageDays <= 730 && direct) {
    return {
      status: "Свежие данные",
      reason: `Карточка обновлялась ${validDate?.toLocaleDateString("ru-RU")} и содержит прямой контакт`,
    };
  }

  if ((ageDays !== null && ageDays <= 1095) || direct || v.website) {
    return {
      status: "Вероятно актуально",
      reason: direct
        ? "Есть действующий формат прямого контакта, но площадку всё равно нужно открыть в Яндекс Картах"
        : "Есть сайт или относительно свежая карточка, требуется подтверждение режима работы",
    };
  }

  return {
    status: "Проверить вручную",
    reason: "Нет свежего подтверждения работы - открой Яндекс Карты и проверь статус, афишу и последние отзывы",
  };
}

function productFor(v: RawVenue) {
  const segment = segmentFor(v);
  if (["Ночной клуб", "Музыкальная площадка", "Караоке", "Рестобар / лаунж", "Бар / паб"].includes(segment)) {
    return { product: "KAVA MC Club Set", price: "15 000 ₽ + трансфер" };
  }
  if (v.amenity === "events_venue" || hasAny(text(v.name, v.description), EVENT_WORDS)) {
    return { product: "KAVA MC + Live Guitar / банкет", price: "от 30 000 ₽ + трансфер" };
  }
  return { product: "Гостевая пятница / суббота с KAVA MC", price: "15 000 ₽ + трансфер" };
}

function reasonFor(v: RawVenue) {
  const segment = segmentFor(v);
  if (segment === "Ночной клуб") return "Ночной формат - MC усиливает DJ-сет, контакт с залом и динамику вечера";
  if (segment === "Музыкальная площадка") return "Можно предложить MC-поддержку концертов, DJ-сетов и специальных вечеринок";
  if (segment === "Караоке") return "Караоке-аудитории нужен ведущий, который держит темп, вовлекает гостей и поддерживает DJ";
  if (segment === "Рестобар / лаунж") return "Рестобар можно усилить вечерней программой без превращения заведения в конкурсный ад";
  if (segment === "Бар / паб") return "Подходит под гостевую пятницу, тематическую вечеринку или регулярную резиденцию";
  if (segment === "Ресторан с вечерним форматом") return "Есть признаки позднего или музыкального формата - можно предложить тестовую пятницу";
  return "Площадке можно продать специальную дату, банкет или готовую вечернюю программу";
}

function decisionMakerFor(v: RawVenue) {
  const segment = segmentFor(v);
  if (["Ночной клуб", "Музыкальная площадка", "Караоке", "Рестобар / лаунж", "Бар / паб"].includes(segment)) {
    return "Управляющий / арт-директор / booking";
  }
  if (v.amenity === "events_venue") return "Управляющий / банкетный менеджер / собственник";
  return "Управляющий / банкетный менеджер / маркетолог";
}

function toLead(v: RawVenue): Lead {
  const nightlife = nightlifeRelevant(v);
  const nScore = nightlifeScore(v);
  const score = nScore;
  const direct = directContact(v);
  const priority: Lead["priority"] = score >= 125 ? "A" : score >= 90 ? "B" : "C";
  const labels = { A: "Высокий", B: "Средний", C: "На проверку" } as const;
  const offer = productFor(v);
  const actuality = actualityFor(v);
  const pipelineStatus = direct ? "Писать сейчас" : v.website ? "Найти ЛПР" : "Проверить";

  return {
    ...v,
    id: `${v.osm_type}-${v.osm_id}`,
    score,
    nightlife_score: nScore,
    priority,
    priority_label: labels[priority],
    qualified: Boolean(v.name) && nightlife && score >= 70,
    nightlife_relevant: nightlife,
    late_hours: isLate(v),
    venue_segment: segmentFor(v),
    direct_contact: direct,
    contact_channel: contactChannel(v),
    product: offer.product,
    price: offer.price,
    reason: reasonFor(v),
    decision_maker: decisionMakerFor(v),
    pipeline_status: pipelineStatus,
    next_step: pipelineStatus === "Писать сейчас"
      ? "Открыть Яндекс Карты, подтвердить работу и отправить персональное сообщение"
      : pipelineStatus === "Найти ЛПР"
        ? "Открыть сайт и Яндекс Карты, найти управляющего или booking"
        : "Проверить актуальность, афишу, последние отзывы и вечерний формат",
    actuality_status: actuality.status,
    actuality_reason: actuality.reason,
    actuality_checked_at: new Date().toISOString(),
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
    const focus = request.nextUrl.searchParams.get("focus") ?? "nightlife";
    const format = request.nextUrl.searchParams.get("format") === "csv" ? "csv" : "json";
    const rawUrl = new URL("/api/venues?includeCafe=false", request.nextUrl.origin);
    const rawResponse = await fetch(rawUrl, { cache: "no-store", signal: AbortSignal.timeout(58_000) });

    if (!rawResponse.ok) {
      return NextResponse.json({ error: "Не удалось загрузить исходную базу", status: rawResponse.status }, { status: 502 });
    }

    const payload = await rawResponse.json() as { generatedAt?: string; venues?: RawVenue[] };
    const allLeads = (payload.venues ?? []).map(toLead);
    const leads = allLeads
      .filter((lead) => {
        if (all) return true;
        if (focus === "all") return Boolean(lead.name) && lead.score >= 55;
        return lead.qualified;
      })
      .sort((a, b) => b.score - a.score || a.city.localeCompare(b.city, "ru") || a.name.localeCompare(b.name, "ru"));

    const stats = {
      raw: allLeads.length,
      nightlife: allLeads.filter((lead) => lead.nightlife_relevant && Boolean(lead.name)).length,
      qualified: leads.filter((lead) => lead.qualified).length,
      highPriority: leads.filter((lead) => lead.priority === "A").length,
      directContact: leads.filter((lead) => lead.direct_contact).length,
      writeNow: leads.filter((lead) => lead.pipeline_status === "Писать сейчас").length,
      findDecisionMaker: leads.filter((lead) => lead.pipeline_status === "Найти ЛПР").length,
      research: leads.filter((lead) => lead.pipeline_status === "Проверить").length,
      nightclubs: leads.filter((lead) => lead.venue_segment === "Ночной клуб").length,
      restobars: leads.filter((lead) => lead.venue_segment === "Рестобар / лаунж").length,
      karaoke: leads.filter((lead) => lead.venue_segment === "Караоке").length,
      bars: leads.filter((lead) => lead.venue_segment === "Бар / паб").length,
      lateVenues: leads.filter((lead) => lead.late_hours).length,
      freshData: leads.filter((lead) => lead.actuality_status === "Свежие данные").length,
    };

    if (format === "csv") {
      const headers: Array<keyof Lead> = [
        "id", "name", "venue_segment", "amenity", "city", "address", "phone", "email", "telegram", "vk", "instagram",
        "website", "yandex_maps_url", "opening_hours", "late_hours", "cuisine", "capacity", "priority", "priority_label",
        "score", "direct_contact", "contact_channel", "product", "price", "reason", "decision_maker", "pipeline_status",
        "next_step", "actuality_status", "actuality_reason", "actuality_checked_at", "osm_updated_at", "latitude", "longitude",
        "osm_url", "source",
      ];
      const csv = [headers.join(";"), ...leads.map((lead) => headers.map((header) => csvEscape(lead[header])).join(";"))].join("\n");
      return new NextResponse(`\uFEFF${csv}`, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=kava-mc-nightlife-leads-${new Date().toISOString().slice(0, 10)}.csv`,
          "Cache-Control": "no-store",
          "X-Leads-Count": String(leads.length),
        },
      });
    }

    return NextResponse.json({
      generatedAt: payload.generatedAt ?? new Date().toISOString(),
      source: "OpenStreetMap contributors via Overpass API",
      area: "Московская область",
      focus,
      stats,
      leads,
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json({
      error: "Не удалось собрать квалифицированную базу лидов",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 502 });
  }
}
