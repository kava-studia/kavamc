import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type VerifyInput = {
  id: string;
  website?: string;
  phone?: string;
  email?: string;
  telegram?: string;
  vk?: string;
  instagram?: string;
};

type WebsiteCheck = {
  reachable: boolean;
  status: number | null;
  finalUrl: string;
  error: string;
};

function normaliseWebsite(value: string) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
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

async function fetchWebsite(rawUrl: string): Promise<WebsiteCheck> {
  const website = normaliseWebsite(rawUrl);
  if (!website) return { reachable: false, status: null, finalUrl: "", error: "Сайт не указан" };

  try {
    const url = new URL(website);
    if (!["http:", "https:"].includes(url.protocol) || isUnsafeHost(url.hostname)) {
      return { reachable: false, status: null, finalUrl: website, error: "Небезопасный адрес" };
    }

    const request = async (method: "HEAD" | "GET") => fetch(url, {
      method,
      redirect: "follow",
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KAVA-MC-Venue-Check/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(6_000),
    });

    let response = await request("HEAD");
    if (response.status === 405 || response.status === 403) response = await request("GET");

    return {
      reachable: response.status >= 200 && response.status < 500,
      status: response.status,
      finalUrl: response.url || website,
      error: "",
    };
  } catch (error) {
    return {
      reachable: false,
      status: null,
      finalUrl: website,
      error: error instanceof Error ? error.message : "Ошибка проверки",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { leads?: VerifyInput[] };
    const leads = Array.isArray(body.leads) ? body.leads.slice(0, 40) : [];

    const results = await Promise.all(leads.map(async (lead) => {
      const website = await fetchWebsite(lead.website ?? "");
      const hasDirectContact = Boolean(lead.phone || lead.email || lead.telegram || lead.vk || lead.instagram);

      const status = website.reachable
        ? "Сайт отвечает"
        : hasDirectContact
          ? "Контакт найден - проверить карту"
          : "Нужна проверка в Яндекс Картах";

      const reason = website.reachable
        ? `Официальный сайт ответил кодом ${website.status}`
        : hasDirectContact
          ? "Есть прямой контакт, но официальный сайт не подтвердил работу"
          : "Автоматического подтверждения работы нет";

      return {
        id: lead.id,
        status,
        reason,
        checkedAt: new Date().toISOString(),
        websiteReachable: website.reachable,
        websiteStatus: website.status,
        websiteFinalUrl: website.finalUrl,
        websiteError: website.error,
      };
    }));

    return NextResponse.json({
      checkedAt: new Date().toISOString(),
      count: results.length,
      results,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({
      error: "Не удалось проверить актуальность заведений",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 400 });
  }
}
