"use client";

import { useEffect, useState } from "react";

const links = [
  ["Возможности", "#services"],
  ["Форматы", "#formats"],
  ["Медиа", "#video"],
  ["Опыт", "#experience"],
  ["Контакты", "#contacts"],
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <>
      <button className="menu-toggle" type="button" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span /><span />
      </button>
      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Мобильная навигация">
          {links.map(([label, href], index) => (
            <a key={href} href={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}</a>
          ))}
        </nav>
        <a className="button button-primary" href="https://t.me/kava_studia" target="_blank" rel="noreferrer">Обсудить дату ↗</a>
      </div>
    </>
  );
}