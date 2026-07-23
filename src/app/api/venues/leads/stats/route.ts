import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const leadsUrl = new URL("/api/venues/leads", request.nextUrl.origin);
    const response = await fetch(leadsUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(58_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Не удалось получить статистику лидов", status: response.status },
        { status: 502 },
      );
    }

    const payload = await response.json() as {
      generatedAt?: string;
      source?: string;
      area?: string;
      stats?: Record<string, number>;
    };

    return NextResponse.json(
      {
        generatedAt: payload.generatedAt,
        source: payload.source,
        area: payload.area,
        stats: payload.stats,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Не удалось получить статистику лидов",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
