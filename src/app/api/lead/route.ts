import { NextRequest, NextResponse } from "next/server";

type Lead = {
  name?: string;
  venue?: string;
  city?: string;
  date?: string;
  format?: string;
  contact?: string;
  comment?: string;
  website?: string;
};

function leadText(lead: Lead) {
  return [
    "Новая заявка KAVA MC",
    `Имя: ${lead.name}`,
    `Заведение: ${lead.venue || "не указано"}`,
    `Город: ${lead.city}`,
    `Дата: ${lead.date || "уточняется"}`,
    `Формат: ${lead.format}`,
    `Контакт: ${lead.contact}`,
    `Комментарий: ${lead.comment || "нет"}`,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const lead = (await request.json()) as Lead;

    if (lead.website) {
      return NextResponse.json({ ok: true });
    }

    if (!lead.name || !lead.city || !lead.contact || !lead.format) {
      return NextResponse.json({ error: "Заполните имя, город, формат и контакт" }, { status: 400 });
    }

    const text = leadText(lead);
    const tasks: Promise<Response>[] = [];

    if (process.env.LEADS_WEBHOOK_URL) {
      tasks.push(
        fetch(process.env.LEADS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: "kavamc-site", ...lead, createdAt: new Date().toISOString() }),
        }),
      );
    }

    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      tasks.push(
        fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text }),
        }),
      );
    }

    if (process.env.RESEND_API_KEY && process.env.LEADS_TO_EMAIL) {
      tasks.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.LEADS_FROM_EMAIL || "KAVA MC <onboarding@resend.dev>",
            to: [process.env.LEADS_TO_EMAIL],
            subject: `KAVA MC - ${lead.format} - ${lead.city}`,
            text,
          }),
        }),
      );
    }

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "Форма ещё не подключена к Telegram. Сейчас открою прямой чат." },
        { status: 503 },
      );
    }

    const results = await Promise.allSettled(tasks);
    const delivered = results.some((result) => result.status === "fulfilled" && result.value.ok);

    if (!delivered) {
      return NextResponse.json({ error: "Заявка не доставлена. Открываю Telegram." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Некорректная заявка" }, { status: 400 });
  }
}
