import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.nchc.org.tw/api/interpreter",
];

const ALLOWED_TYPES = [
  "restaurant",
  "bar",
  "pub",
  "nightclub",
  "cafe",
  "biergarten",
  "events_venue",
  "music_venue",
  "karaoke_box",
  "music_club",
  "dance_venue",
] as const;

const CSV_HEADERS = [
  "osm_type",
  "osm_id",
  "name",
  "amenity",
  "city",
  "district",
  "street",
  "house_number",
  "address",
  "phone",
  "email",
  "website",
  "telegram",
  "vk",
  "instagram",
  "opening_hours",
  "cuisine",
  "capacity",
  "description",
  "latitude",
  "longitude",
  "osm_updated_at",
  "yandex_maps_url",
  "osm_url",
] as const;

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  timestamp?: string;
  tags?: Record<string, string>;
};

type VenueRow = Record<(typeof CSV_HEADERS)[number], string | number>;

function value(tags: Record<string, string>, ...keys: string[]) {
  for (const key of keys) {
    const candidate = tags[key]?.trim();
    if (candidate) return candidate;
  }
  return "";
}

function normalisePhone(phone: string) {
  return phone.replace(/\s+/g, " ").trim();
}

function escapeCsv(input: string | number) {
  const text = String(input ?? "");
  if (/[";\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function buildAddress(tags: Record<string, string>) {
  const city = value(tags, "addr:city", "addr:town", "addr:village", "addr:municipality", "addr:place");
  const street = value(tags, "addr:street");
  const house = value(tags, "addr:housenumber");
  return [city, street, house].filter(Boolean).join(", ");
}

function buildYandexMapsUrl(name: string, address: string, city: string, lat: number | string, lon: number | string) {
  const query = [name, address || city].filter(Boolean).join(", ");
  if (query) return `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`;
  if (lat !== "" && lon !== "") return `https://yandex.ru/maps/?text=${encodeURIComponent(`${lat},${lon}`)}`;
  return "https://yandex.ru/maps/";
}

function inferAmenity(tags: Record<string, string>) {
  const amenity = value(tags, "amenity");
  if (amenity) return amenity;
  if (tags.club === "music") return "music_club";
  if (tags.leisure === "dance") return "dance_venue";
  return "";
}

function isLifecycleClosed(tags: Record<string, string>) {
  return tags.disused === "yes"
    || tags.abandoned === "yes"
    || tags.closed === "yes"
    || Boolean(tags["disused:amenity"])
    || Boolean(tags["abandoned:amenity"])
    || Boolean(tags["demolished:amenity"])
    || Boolean(tags["was:amenity"]);
}

function toVenue(element: OverpassElement): VenueRow | null {
  const tags = element.tags ?? {};
  const amenity = inferAmenity(tags);
  if (!ALLOWED_TYPES.includes(amenity as (typeof ALLOWED_TYPES)[number])) return null;
  if (isLifecycleClosed(tags)) return null;

  const lat = element.lat ?? element.center?.lat ?? "";
  const lon = element.lon ?? element.center?.lon ?? "";
  const name = value(tags, "name", "brand", "operator");
  const city = value(tags, "addr:city", "addr:town", "addr:village", "addr:municipality", "addr:place");
  const address = buildAddress(tags);

  return {
    osm_type: element.type,
    osm_id: element.id,
    name,
    amenity,
    city,
    district: value(tags, "addr:district", "addr:suburb"),
    street: value(tags, "addr:street"),
    house_number: value(tags, "addr:housenumber"),
    address,
    phone: normalisePhone(value(tags, "contact:phone", "phone", "contact:mobile", "mobile")),
    email: value(tags, "contact:email", "email"),
    website: value(tags, "contact:website", "website", "url"),
    telegram: value(tags, "contact:telegram", "telegram"),
    vk: value(tags, "contact:vk", "vk"),
    instagram: value(tags, "contact:instagram", "instagram"),
    opening_hours: value(tags, "opening_hours"),
    cuisine: value(tags, "cuisine"),
    capacity: value(tags, "capacity"),
    description: value(tags, "description", "note"),
    latitude: lat,
    longitude: lon,
    osm_updated_at: element.timestamp ?? "",
    yandex_maps_url: buildYandexMapsUrl(name, address, city, lat, lon),
    osm_url: `https://www.openstreetmap.org/${element.type}/${element.id}`,
  };
}

async function fetchOverpass(query: string) {
  const failures: string[] = [];

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent": "KAVA-MC-Venue-Research/1.1 (juri.kava@yandex.ru)",
        },
        body: new URLSearchParams({ data: query }),
        cache: "no-store",
        signal: AbortSignal.timeout(55_000),
      });

      if (!response.ok) {
        failures.push(`${endpoint}: ${response.status}`);
        continue;
      }

      return (await response.json()) as { elements?: OverpassElement[] };
    } catch (error) {
      failures.push(`${endpoint}: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }

  throw new Error(`Overpass unavailable. ${failures.join(" | ")}`);
}

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get("format") === "csv" ? "csv" : "json";
  const includeCafe = request.nextUrl.searchParams.get("includeCafe") !== "false";
  const amenityPattern = includeCafe
    ? "restaurant|bar|pub|nightclub|cafe|biergarten|events_venue|music_venue|karaoke_box"
    : "restaurant|bar|pub|nightclub|biergarten|events_venue|music_venue|karaoke_box";

  const query = `[out:json][timeout:50];\narea(3600051490)->.moscowOblast;\n(\n  nwr[\"amenity\"~\"^(${amenityPattern})$\"](area.moscowOblast);\n  nwr[\"club\"=\"music\"](area.moscowOblast);\n  nwr[\"leisure\"=\"dance\"](area.moscowOblast);\n);\nout center tags meta;`;

  try {
    const payload = await fetchOverpass(query);
    const seen = new Set<string>();
    const venues = (payload.elements ?? [])
      .map(toVenue)
      .filter((venue): venue is VenueRow => Boolean(venue))
      .filter((venue) => {
        const key = `${venue.osm_type}-${venue.osm_id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => String(a.city).localeCompare(String(b.city), "ru") || String(a.name).localeCompare(String(b.name), "ru"));

    if (format === "csv") {
      const csv = [
        CSV_HEADERS.join(";"),
        ...venues.map((venue) => CSV_HEADERS.map((header) => escapeCsv(venue[header])).join(";")),
      ].join("\n");

      return new NextResponse(`\uFEFF${csv}`, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=moscow-oblast-venues-${new Date().toISOString().slice(0, 10)}.csv`,
          "Cache-Control": "no-store",
          "X-Venues-Count": String(venues.length),
        },
      });
    }

    return NextResponse.json(
      {
        generatedAt: new Date().toISOString(),
        source: "OpenStreetMap contributors via Overpass API",
        area: "Moscow Oblast",
        count: venues.length,
        venues,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Не удалось получить данные заведений",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
