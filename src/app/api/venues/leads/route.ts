import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type RawVenue = {
  osm_type: string;
  osm_id: number | string;
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
  "grill bar", "гриль бар", "music bar", "караоке", "karaoke", "кальян", "hookah",
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

function directContact(venue: RawVenue) {
  return Boolean(venue.phone || venue.email || venue.telegram || venue.vk || venue.instagram);
}

function contactChannel(venue: RawVenue) {
  if (venue.telegram) return "Telegram";
  if (venue.vk) return "VK";
  if (venue.instagram) return "Instagram";
  if (venue.email) return "Email";
  if (venue.phone) return "Телефон";
  if (venue.website) return "Сайт";
  return "Искать контакт";
}

function isLate(venue: RawVenue) {
  const hours = venue.opening_hours || "";
  return /24:00|00:00|00:30|01:00|01:30|02:00|02:30|03:00|04:00|05:00|06:00/.test(hours)
    || /24\/7/i.test(hours);
}

function yandexMapsUrl(venue: RawVenue) {
  if (venue.yandex_maps_url) return venue.yandex_maps_url;
  const query = [venue.name, venue.address || venue.city].filter(Boolean).join(", ");
  return query
    ? `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`
    : "https://yandex.ru/maps/";
}

function segmentFor(venue: RawVenue) {
  const corpus = text(venue.name, venue.description, venue.cuisine);
  if (["nightclub", "music_club", "dance_venue"].includes(venue.amenity)) return "Ночной клуб";
  if (venue.amenity === "music_venue") return "Музыкальная площадка";
  if (venue.amenity === "karaoke_box" || hasAny(corpus, ["караоке", "karaoke"])) return "Караоке";
  if (hasAny(corpus, RESTOBAR_WORDS)) return "Рестобар / вечерний ресторан";
  if (["bar", "pub", "biergarten"].includes(venue.amenity)) return "Бар / паб";
  if (venue.amenity === "restaurant" && (isLate(venue) || hasAny(corpus, NIGHTLIFE_WORDS))) {
    return "Рестобар / вечерний ресторан";
  }
  if (venue.amenity === "events_venue") return "Event-площадка";
  return "Обычный ресторан";
}

function nightlifeRelevant(venue: RawVenue) {
  const corpus = text(venue.name, venue.description, venue.cuisine);
  return NIGHTLIFE_TYPES.includes(venue.amenity)
    || hasAny(corpus, NIGHTLIFE_WORDS)
    || (venue.amenity === "restaurant" && isLate(venue));
}

function nightlifeScore(venue: RawVenue) {
  const corpus = text(venue.name, venue.description, venue.cuisine);
  let score = 0;

  switch (venue.amenity) {
    case "nightclub": score += 140; break;
    case "music_club": score += 136; break;
    case "dance_venue": score += 132; break;
    case "music_venue": score += 126; break;
    case "karaoke_box": score += 122; break;
    case "bar": score += 104; break;
    case "pub": score += 100; break;
    case "biergarten": score += 90; break;
    case "events_venue": score += 68; break;
    case "restaurant": score += 42; break;
    default: score += 20;
  }

  if (hasAny(corpus, RESTOBAR_WORDS)) score += 42;
  if (venue.amenity === "restaurant" && isLate(venue)) score += 38;
  if (hasAny(corpus, ["ночной", "night", "club", "клуб", "dance", "dj", "диджей"])) score += 34;
  if (hasAny(corpus, ["караоке", "karaoke"])) score += 30;
  if (hasAny(corpus, ["live", "music", "музык", "концерт", "вечерин"])) score += 24;
  if (isLate(venue)) score += 20;
  if (directContact(venue)) score += 18;
  if (venue.telegram || venue.vk || venue.instagram) score += 8;
  if (venue.website) score += 6;
  if (venue.capacity && Number(venue.capacity) >= 50) score += 8;
  if (hasAny(corpus, EVENT_WORDS)) score += 8;
  if (!venue.city) score -= 4;
  if (!venue.name) score -= 220;
  if (hasAny(corpus, JUNK_WORDS)) score -= 200;
  return score;
}

function actualityFor(venue: RawVenue, snapshotGeneratedAt: string) {
  const direct = directContact(venue);
  const snapshotDate = new Date(snapshotGeneratedAt);
  const snapshotIsFresh = !Number.isNaN(snapshotDate.getTime())
    && Date.now() - snapshotDate.getTime() <= 14 * 86_400_000;

  if (snapshotIsFresh && direct) {
    return {
      status: "Свежие данные" as ActualityStatus,
      reason: "База обновлена недавно и содержит прямой контакт. Окончательно проверь статус в Яндекс Картах",
    };
  }

  if (snapshotIsFresh || direct || venue.website) {
    return {
      status: "Вероятно актуально" as ActualityStatus,
      reason: venue.website || direct
        ? "Есть сайт или прямой контакт. Система дополнительно проверит сайт на текущей странице"
        : "Точка есть в свежем снимке карты, но требует подтверждения в Яндекс Картах",
    };
  }

  return {
    status: "Проверить вручную" as ActualityStatus,
    reason: "Нет автоматического подтверждения работы - проверь Яндекс Карты, афишу и последние отзывы",
  };
}

function productFor(venue: RawVenue) {
  const segment = segmentFor(venue);
  if (["Ночной клуб", "Музыкальная площадка", "Караоке", "Рестобар / вечерний ресторан", "Бар / паб"].includes(segment)) {
    return { product: "KAVA MC Club Set", price: "15 000 ₽ + трансфер" };
  }
  if (venue.amenity === "events_venue" || hasAny(text(venue.name, venue.description), EVENT_WORDS)) {
    return { product: "KAVA MC + Live Guitar / банкет", price: "от 30 000 ₽ + трансфер" };
  }
  return { product: "Гостевая пятница / суббота с KAVA MC", price: "15 000 ₽ + трансфер" };
}

function reasonFor(venue: RawVenue) {
  const segment = segmentFor(venue);
  if (segment === "Ночной клуб") return "Ночной формат - MC усиливает DJ-сет, контакт с залом и динамику вечера";
  if (segment === "Музыкальная площадка") return "Можно предложить MC-поддержку концертов, DJ-сетов и специальных вечеринок";
  if (segment === "Караоке") return "Караоке-аудитории нужен ведущий, который держит темп, вовлекает гостей и поддерживает DJ";
  if (segment === "Рестобар / вечерний ресторан") return "Поздний ресторанный формат подходит под гостевую пятницу, DJ-сет и регулярную программу с MC";
  if (segment === "Бар / паб") return "Подходит под гостевую пятницу, тематическую вечеринку или регулярную резиденцию";
  return "Площадке можно продать специальную дату, банкет или готовую вечернюю программу";
}

function decisionMakerFor(venue: RawVenue) {
  const segment = segmentFor(venue);
  if (["Ночной клуб", "Музыкальная площадка", "Караоке", "Рестобар / вечерний ресторан", "Бар / паб"].includes(segment)) {
    return "Управляющий / арт-директор / booking";
  }
  if (venue.amenity === "events_venue") return "Управляющий / банкетный менеджер / собственник";
  return "Управляющий / маркетолог";
}

function toLead(venue: RawVenue, snapshotGeneratedAt: string): Lead {
  const nightlife = nightlifeRelevant(venue);
  const score = nightlifeScore(venue);
  const direct = directContact(venue);
  const priority: Lead["priority"] = score >= 135 ? "A" : score >= 92 ? "B" : "C";
  const labels = { A: "Высокий", B: "Средний", C: "На проверку" } as const;
  const offer = productFor(venue);
  const actuality = actualityFor(venue, snapshotGeneratedAt);
  const pipelineStatus = direct ? "Писать сейчас" : venue.website ? "Найти ЛПР" : "Проверить";

  return {
    ...venue,
    yandex_maps_url: yandexMapsUrl(venue),
    id: `${venue.osm_type}-${venue.osm_id}`,
    score,
    nightlife_score: score,
    priority,
    priority_label: labels[priority],
    qualified: Boolean(venue.name) && nightlife && score >= 75,
    nightlife_relevant: nightlife,
    late_hours: isLate(venue),
    venue_segment: segmentFor(venue),
    direct_contact: direct,
    contact_channel: contactChannel(venue),
    product: offer.product,
    price: offer.price,
    reason: reasonFor(venue),
    decision_maker: decisionMakerFor(venue),
    pipeline_status: pipelineStatus,
    next_step: pipelineStatus === "Писать сейчас"
      ? "Открыть Яндекс Карты, подтвердить работу и отправить персональное сообщение"
      : pipelineStatus === "Найти ЛПР"
        ? "Открыть официальный сайт и Яндекс Карты, найти управляющего или booking"
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
    const rawUrl = new URL("/api/venues", request.nextUrl.origin);
    const rawResponse = await fetch(rawUrl, { cache: "no-store", signal: AbortSignal.timeout(20_000) });

    if (!rawResponse.ok) {
      return NextResponse.json({ error: "Не удалось загрузить исходную базу", status: rawResponse.status }, { status: 502 });
    }

    const payload = await rawResponse.json() as { generatedAt?: string; venues?: RawVenue[] };
    const generatedAt = payload.generatedAt ?? new Date().toISOString();
    const allLeads = (payload.venues ?? []).map((venue) => toLead(venue, generatedAt));
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
      restobars: leads.filter((lead) => lead.venue_segment === "Рестобар / вечерний ресторан").length,
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
      generatedAt,
      source: "OpenStreetMap contributors via Overpass API",
      area: "Московская область",
      focus,
      stats,
      leads,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({
      error: "Не удалось собрать квалифицированную базу лидов",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 502 });
  }
}
