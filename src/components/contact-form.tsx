"use client";

import { useState } from "react";
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

type EventId = (typeof eventOptions)[number]["id"];

export function ContactForm() {
  const [selected, setSelected] = useState<EventId>("wedding");
  const current = eventOptions.find((item) => item.id === selected) ?? eventOptions[0];

  function openTelegram() {
    const url = `${links.telegram}?text=${encodeURIComponent(current.message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="quick-brief">
      <div className="quick-brief-head">
        <span>Короткий бриф</span>
        <h3>Что планируем?</h3>
        <p>Выберите формат. Telegram откроется сразу с готовым первым сообщением — дальше общаемся уже лично.</p>
      </div>

      <div className="event-type-grid" role="radiogroup" aria-label="Тип события">
        {eventOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={selected === item.id}
            className={selected === item.id ? "is-selected" : ""}
            onClick={() => setSelected(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="quick-brief-preview">
        <span>Сообщение</span>
        <p>{current.message}</p>
      </div>

      <button className="quick-brief-submit" type="button" onClick={openTelegram}>
        Продолжить в Telegram <span aria-hidden="true">↗</span>
      </button>
      <small>Сайт ничего не сохраняет: выбранный вариант используется только для подготовки текста сообщения.</small>
    </div>
  );
}
