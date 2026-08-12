"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const COOKIE_STORAGE_KEY = "kavamc_cookie_consent_v1";
export const COOKIE_CONSENT_EVENT = "kavamc-cookie-consent-changed";

type Choice = "essential" | "all";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem(COOKIE_STORAGE_KEY));
  }, []);

  function save(choice: Choice) {
    window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({ choice, date: new Date().toISOString() }));
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { choice } }));
    setVisible(false);
    setSettings(false);
  }

  if (!visible) return null;

  return (
    <aside className="cookie-panel" aria-label="Настройки файлов cookie">
      <div className="cookie-topline"><span>COOKIE SETTINGS</span><button type="button" onClick={() => save("essential")} aria-label="Закрыть">×</button></div>
      <h2>Сайт уважает приватность.</h2>
      <p>Необходимые настройки используются для работы сайта. Аналитика Яндекс Метрики включается только после выбора «Принять» и только если счётчик подключён владельцем сайта.</p>
      {settings && (
        <div className="cookie-settings">
          <div><strong>Необходимые</strong><span>Всегда включены · сохраняют выбор настроек</span></div>
          <div><strong>Аналитические</strong><span>Яндекс Метрика · только после согласия</span></div>
          <div><strong>Рекламные</strong><span>Не используются</span></div>
        </div>
      )}
      <div className="cookie-actions">
        <button className="button button-primary" type="button" onClick={() => save("all")}>Принять</button>
        <button className="button button-ghost" type="button" onClick={() => save("essential")}>Только необходимые</button>
        <button className="cookie-link" type="button" onClick={() => setSettings((value) => !value)}>{settings ? "Скрыть настройки" : "Настроить"}</button>
      </div>
      <p className="cookie-legal">Подробнее в <Link href="/cookies">политике cookies</Link> и <Link href="/privacy">политике конфиденциальности</Link>.</p>
    </aside>
  );
}
