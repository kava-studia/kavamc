"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const initialForm = {
  name: "",
  eventType: "Свадьба",
  city: "",
  date: "",
  venue: "",
  guests: "",
  format: "Проведение мероприятия",
  contact: "",
  comment: "",
  consent: false,
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.consent) {
      setMessage("Нужно дать отдельное согласие на обработку персональных данных.");
      return;
    }

    const text = [
      "Здравствуйте! Хочу обсудить мероприятие с KAVA STUDIA.",
      `Имя: ${form.name}`,
      `Тип события: ${form.eventType}`,
      `Город: ${form.city}`,
      `Дата: ${form.date || "уточняется"}`,
      `Площадка: ${form.venue || "ещё не выбрана"}`,
      `Количество гостей: ${form.guests || "уточняется"}`,
      `Что требуется: ${form.format}`,
      `Контакт: ${form.contact}`,
      `Комментарий: ${form.comment || "нет"}`,
    ].join("\n");

    window.open(`https://t.me/kava_studia?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setMessage("Открыл Telegram с готовым сообщением. Проверьте текст и нажмите «Отправить».");
  }

  function update(field: keyof typeof initialForm, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form className="lead-form" onSubmit={submit} data-reveal>
      <div className="form-header">
        <span>ПРОВЕРКА ДАТЫ</span>
        <strong>Расскажите о событии</strong>
        <p>Данные остаются в вашем браузере и передаются только после отправки сообщения в Telegram.</p>
      </div>

      <div className="form-grid">
        <label>
          <span>Имя</span>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Как к вам обращаться" />
        </label>

        <label>
          <span>Тип события</span>
          <select value={form.eventType} onChange={(e) => update("eventType", e.target.value)}>
            <option>Свадьба</option>
            <option>Корпоратив</option>
            <option>День рождения или юбилей</option>
            <option>Выпускной</option>
            <option>Открытие или презентация</option>
            <option>Клубное мероприятие</option>
            <option>Другое событие</option>
          </select>
        </label>

        <label>
          <span>Город</span>
          <input required value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Сергиев Посад или Москва" />
        </label>

        <label>
          <span>Дата</span>
          <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
        </label>

        <label>
          <span>Площадка</span>
          <input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder="Название или ещё не выбрана" />
        </label>

        <label>
          <span>Количество гостей</span>
          <input inputMode="numeric" value={form.guests} onChange={(e) => update("guests", e.target.value)} placeholder="Например, 45" />
        </label>

        <label className="form-wide">
          <span>Что требуется</span>
          <select value={form.format} onChange={(e) => update("format", e.target.value)}>
            <option>Проведение мероприятия</option>
            <option>Ведущий и DJ</option>
            <option>Организация под ключ</option>
            <option>Координация</option>
            <option>Подбор площадки и подрядчиков</option>
            <option>Клубный MC</option>
            <option>Нужна консультация</option>
          </select>
        </label>

        <label className="form-wide">
          <span>Телефон или Telegram</span>
          <input required value={form.contact} onChange={(e) => update("contact", e.target.value)} placeholder="@username или +7" />
        </label>

        <label className="form-wide">
          <span>Комментарий</span>
          <textarea value={form.comment} onChange={(e) => update("comment", e.target.value)} placeholder="Что уже известно о мероприятии и какая помощь нужна" rows={4} />
        </label>
      </div>

      <label className="consent-check">
        <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} required />
        <span>Я отдельно и добровольно даю <Link href="/consent" target="_blank">согласие на обработку персональных данных</Link> для ответа на обращение. С <Link href="/privacy" target="_blank">политикой конфиденциальности</Link> ознакомлен.</span>
      </label>

      <div className="form-footer">
        <button className="button button-primary" type="submit">Продолжить в Telegram ↗</button>
        <p className={`form-message ${message ? "success" : ""}`}>{message || "Предпочтительная связь - Telegram"}</p>
      </div>
    </form>
  );
}
