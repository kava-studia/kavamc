"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const links = [
  ["Возможности", "#services"],
  ["Форматы и цены", "#formats"],
  ["Видео", "#video"],
  ["Опыт", "#experience"],
  ["Контакты", "#contacts"],
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const panel = (
    <>
      <button
        className={`mobile-menu-backdrop ${open ? "open" : ""}`}
        type="button"
        aria-label="Закрыть меню"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />
      <aside className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-head">
          <div className="mobile-menu-brand">KAVA <span>MC</span></div>
          <button className="mobile-menu-close" type="button" onClick={() => setOpen(false)} aria-label="Закрыть меню">
            <span>×</span> Закрыть
          </button>
        </div>
        <nav aria-label="Мобильная навигация">
          {links.map(([label, href], index) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span><strong>{label}</strong><i>›</i>
            </a>
          ))}
        </nav>
        <div className="mobile-menu-booking">
          <div className="mobile-menu-booking-copy">
            <span className="mobile-menu-booking-icon">✦</span>
            <div><strong>Готовы обсудить событие?</strong><p>Отвечу быстро и по делу.</p></div>
          </div>
          <a href="https://t.me/kava_studia" target="_blank" rel="noreferrer">Обсудить дату <span>→</span></a>
          <small>Конфиденциально · Быстрый ответ · Индивидуальный подход</small>
        </div>
      </aside>
    </>
  );

  return (
    <>
      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span /><span /><small>Меню</small>
      </button>
      {mounted ? createPortal(panel, document.body) : null}
    </>
  );
}
