import { NextRequest, NextResponse } from "next/server";
import { gzipSync } from "node:zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const part = Math.max(0, Number(request.nextUrl.searchParams.get("part") ?? "0") || 0);
    const chunkSize = Math.min(
      30000,
      Math.max(5000, Number(request.nextUrl.searchParams.get("size") ?? "20000") || 20000),
    );

    const response = await fetch(
      "https://kavamc.vercel.app/api/venues?includeCafe=false&format=csv",
      { cache: "no-store", signal: AbortSignal.timeout(58_000) },
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Venue CSV is unavailable", status: response.status }, { status: 502 });
    }

    const csv = Buffer.from(await response.arrayBuffer());
    const archive = gzipSync(csv, { level: 9 });
    const encoded = archive.toString("base64");
    const totalParts = Math.ceil(encoded.length / chunkSize);

    if (part >= totalParts) {
      return NextResponse.json(
        { error: "Part is out of range", part, totalParts },
        { status: 416 },
      );
    }

    const start = part * chunkSize;
    const data = encoded.slice(start, start + chunkSize);

    return NextResponse.json(
      {
        generatedAt: new Date().toISOString(),
        part,
        totalParts,
        chunkSize,
        encodedLength: encoded.length,
        compressedBytes: archive.byteLength,
        uncompressedBytes: csv.byteLength,
        encoding: "base64+gzip",
        data,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to encode venue database", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 502 },
    );
  }
}
