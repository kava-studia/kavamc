"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

const initialForm = {
  name: "",
  venue: "",
  city: "",
  date: "",
  format: "KAVA MC Club Set",
  contact: "",
  comment: "",
  website: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось отправить заявку");
      setState("success");
      setMessage("Заявка принята. KAVA MC свяжется с вами в Telegram или по телефону.");
      setForm(initialForm);
    } catch (error) {
      const text = [
        "Здравствуйте! Хочу обсудить KAVA MC.",
        `Имя: ${form.name}`,
        `Заведение: ${form.venue || "не указано"}`,
        `Город: ${form.city}`,
        `Дата: ${form.date || "уточняется"}`,
        `Формат: ${form.format}`,
        `Контакт: ${form.contact}`,
        `Комментарий: ${form.comment || "нет"}`,
      ].join("\n");
      setState("error");
      setMessage(error instanceof Error ? error.message : "Не удалось отправить заявку");
      window.open(`https://t.me/kava_studia?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    }
  }

  function update(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="form-grid">
        <label><span>Имя</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Как к вам обращаться" /></label>
        <label><span>Заведение</span><input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder="Название площадки" /></label>
        <label><span>Город</span><input required value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Москва" /></label>
        <label><span>Дата</span><input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} /></label>
        <label className="form-wide">
          <span>Формат</span>
          <select value={form.format} onChange={(e) => update("format", e.target.value)}>
            <option>KAVA MC Club Set</option>
            <option>KAVA MC + Live Guitar</option>
            <option>Регулярные клубные слоты</option>
            <option>Вечеринка под ключ</option>
            <option>Частное или корпоративное событие</option>
            <option>Event Production</option>
          </select>
        </label>
        <label className="form-wide"><span>Телефон или Telegram</span><input required value={form.contact} onChange={(e) => update("contact", e.target.value)} placeholder="@username или +7" /></label>
        <label className="form-wide"><span>Комментарий</span><textarea value={form.comment} onChange={(e) => update("comment", e.target.value)} placeholder="Расскажите о задаче, музыке и аудитории" rows={4} /></label>
        <label className="honeypot" aria-hidden="true"><span>Website</span><input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} /></label>
      </div>
      <div className="form-footer">
        <button className="button button-primary" disabled={state === "loading"} type="submit">{state === "loading" ? "Отправляю" : "Обсудить дату"}</button>
        <p className={`form-message ${state}`}>{message || "Предпочтительная связь - Telegram"}</p>
      </div>
    </form>
  );
}
