import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_PATH = path.join(process.cwd(), "data", "moscow-oblast-venues-latest.csv");
const META_PATH = path.join(process.cwd(), "data", "moscow-oblast-venues-meta.json");

function parseCsv(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"') {
      if (quoted && next === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === ";" && !quoted) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      value = "";
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  return rows;
}

async function readSnapshot() {
  const [csv, metaText] = await Promise.all([
    readFile(DATA_PATH, "utf8"),
    readFile(META_PATH, "utf8").catch(() => "{}"),
  ]);

  const rows = parseCsv(csv.replace(/^\uFEFF/, ""));
  const headers = rows.shift() ?? [];
  const venues = rows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
  const meta = JSON.parse(metaText) as { generatedAt?: string; source?: string };

  return { csv, venues, meta };
}

export async function GET(request: NextRequest) {
  try {
    const format = request.nextUrl.searchParams.get("format") === "csv" ? "csv" : "json";
    const snapshot = await readSnapshot();

    if (format === "csv") {
      return new NextResponse(snapshot.csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=moscow-oblast-venues-${new Date().toISOString().slice(0, 10)}.csv`,
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "X-Venues-Count": String(snapshot.venues.length),
          "X-Snapshot-Generated-At": snapshot.meta.generatedAt ?? "unknown",
        },
      });
    }

    return NextResponse.json({
      generatedAt: snapshot.meta.generatedAt ?? new Date().toISOString(),
      source: snapshot.meta.source ?? "OpenStreetMap contributors via Overpass API",
      area: "Moscow Oblast",
      snapshot: true,
      count: snapshot.venues.length,
      venues: snapshot.venues,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Snapshot-Generated-At": snapshot.meta.generatedAt ?? "unknown",
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: "Не удалось прочитать сохранённую базу заведений",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
