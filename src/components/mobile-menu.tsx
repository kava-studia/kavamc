"use client";

import { useEffect, useState } from "react";

const links = [
  ["Возможности", "#services"],
  ["Форматы и цены", "#formats"],
  ["Видео", "#video"],
  ["Опыт", "#experience"],
  ["Контакты", "#contacts"],
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <>
      <button className="menu-toggle" type="button" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span /><span />
        <small>{open ? "Закрыть" : "Меню"}</small>
      </button>
      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-topline"><span>KAVA MC</span><span>Навигация</span></div>
        <nav aria-label="Мобильная навигация">
          {links.map(([label, href], index) => (
            <a key={href} href={href} onClick={() => setOpen(false)}><span>0{index + 1}</span><strong>{label}</strong><i>↘</i></a>
          ))}
        </nav>
        <div className="mobile-menu-footer">
          <a className="button button-primary" href="https://t.me/kava_studia" target="_blank" rel="noreferrer">Обсудить дату ↗</a>
          <a href="tel:+79932542217">+7 993 254-22-17</a>
        </div>
      </div>
    </>
  );
}
