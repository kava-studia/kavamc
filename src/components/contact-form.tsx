"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const initialForm = {
  name: "",
  venue: "",
  city: "",
  date: "",
  format: "KAVA MC Club Set",
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
      "Здравствуйте! Хочу обсудить выступление KAVA MC.",
      `Имя: ${form.name}`,
      `Заведение: ${form.venue || "не указано"}`,
      `Город: ${form.city}`,
      `Дата: ${form.date || "уточняется"}`,
      `Формат: ${form.format}`,
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
      <div className="form-header"><span>BOOKING REQUEST</span><strong>Заполните за минуту</strong><p>Данные остаются в вашем браузере и будут переданы только после отправки сообщения в Telegram.</p></div>
      <div className="form-grid">
        <label><span>Имя</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Как к вам обращаться" /></label>
        <label><span>Заведение</span><input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder="Название площадки" /></label>
        <label><span>Город</span><input required value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Москва" /></label>
        <label><span>Дата</span><input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} /></label>
        <label className="form-wide"><span>Формат</span><select value={form.format} onChange={(e) => update("format", e.target.value)}>
          <option>KAVA MC Club Set</option><option>KAVA MC + Live Guitar</option><option>Регулярные клубные слоты</option><option>Вечеринка под ключ</option><option>Частное или корпоративное событие</option><option>Event Production</option>
        </select></label>
        <label className="form-wide"><span>Телефон или Telegram</span><input required value={form.contact} onChange={(e) => update("contact", e.target.value)} placeholder="@username или +7" /></label>
        <label className="form-wide"><span>Комментарий</span><textarea value={form.comment} onChange={(e) => update("comment", e.target.value)} placeholder="Расскажите о задаче, музыке и аудитории" rows={4} /></label>
      </div>
      <label className="consent-check">
        <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} required />
        <span>Я отдельно и добровольно даю <Link href="/consent" target="_blank">согласие на обработку персональных данных</Link> для ответа на обращение. С <Link href="/privacy" target="_blank">политикой конфиденциальности</Link> ознакомлен.</span>
      </label>
      <div className="form-footer">
        <button className="button button-primary" type="submit">Продолжить в Telegram ↗</button>
        <p className={`form-message ${message ? "success" : ""}`}>{message || "Предпочтительная связь · Telegram"}</p>
      </div>
    </form>
  );
}
