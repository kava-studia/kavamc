import { NextResponse } from "next/server";
import { gzipSync } from "node:zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const response = await fetch(
      "https://kavamc.vercel.app/api/venues?includeCafe=false&format=csv",
      { cache: "no-store", signal: AbortSignal.timeout(58_000) },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Venue CSV is unavailable", status: response.status },
        { status: 502 },
      );
    }

    const csv = Buffer.from(await response.arrayBuffer());
    const archive = gzipSync(csv, { level: 9 });

    return new NextResponse(archive, {
      status: 200,
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": `attachment; filename=moscow-oblast-venues-${new Date().toISOString().slice(0, 10)}.csv.gz`,
        "Cache-Control": "no-store",
        "X-Uncompressed-Bytes": String(csv.byteLength),
        "X-Compressed-Bytes": String(archive.byteLength),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to build venue archive",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
