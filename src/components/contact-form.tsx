"use client";

import { links } from "@/data/links";

const eventOptions = [
  {
    id: "wedding",
    label: "Свадьба",
    message: "Здравствуйте! Хочу провести свадьбу с KAVA MC. Хочу обсудить дату и формат.",
  },
  {
    id: "corporate",
    label: "Корпоратив",
    message: "Здравствуйте! Хочу провести корпоратив с KAVA MC. Хочу обсудить дату и формат.",
  },
  {
    id: "organization",
    label: "Организация мероприятия",
    message: "Здравствуйте! Хочу организовать мероприятие с KAVA MC. Хочу обсудить идею, дату и формат.",
  },
  {
    id: "club-show",
    label: "Club Show MC",
    message: "Здравствуйте! Хочу пригласить KAVA MC с Club Show MC. Хочу обсудить дату, площадку и формат.",
  },
  {
    id: "eminem",
    label: "Eminem Live Tribute Show",
    message: "Здравствуйте! Хочу пригласить Eminem Live Tribute Show by KAVA MC. Хочу обсудить дату, площадку и формат.",
  },
  {
    id: "other",
    label: "Другое событие",
    message: "Здравствуйте! Хочу обсудить мероприятие с KAVA MC.",
  },
] as const;

export function ContactForm() {
  function openTelegram(message: string) {
    const url = `${links.telegram}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="quick-brief">
      <div className="quick-brief-head">
        <span>Короткий бриф</span>
        <h3>Что планируем?</h3>
        <p>Нажмите на тип события — сразу откроется Telegram с готовой первой фразой.</p>
      </div>

      <div className="event-type-grid" aria-label="Тип события">
        {eventOptions.map((item) => (
          <button key={item.id} type="button" onClick={() => openTelegram(item.message)}>
            <span>{item.label}</span>
            <b aria-hidden="true">↗</b>
          </button>
        ))}
      </div>

      <small>Сайт ничего не сохраняет и не отправляет до вашего перехода в Telegram.</small>
    </div>
  );
}
