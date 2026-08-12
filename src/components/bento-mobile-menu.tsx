"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  ["Eminem Live Tribute", "/eminem-tribute"],
  ["Свадьбы", "/uslugi/vedushchiy-na-svadbu"],
  ["Корпоративы", "/uslugi/vedushchiy-na-korporativ"],
  ["Организация", "/uslugi/organizatsiya-meropriyatiy"],
  ["Club MC", "/uslugi/club-mc"],
  ["Полезное", "/poleznoe"],
  ["Реферальная программа", "/referral"],
  ["Юридическая информация", "/legal"],
] as const;

export function BentoMobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className={`bento-mobile-menu ${open ? "is-open" : ""}`}>
      <button
        className="bento-menu-toggle"
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      <div className="bento-menu-backdrop" onClick={() => setOpen(false)} />
      <aside className="bento-menu-panel" aria-hidden={!open}>
        <div className="bento-menu-top">
          <strong>KAVA <em>MC</em></strong>
          <span>Организация · Ведение · Шоу</span>
        </div>
        <nav aria-label="Мобильная навигация">
          {links.map(([label, href], index) => (
            <Link href={href} onClick={() => setOpen(false)} key={href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </nav>
        <div className="bento-menu-contacts">
          <a href="https://t.me/kava_studia" target="_blank" rel="noreferrer">Telegram ↗</a>
          <a href="tel:+79932542217">+7 993 254-22-17</a>
          <Link href="/#contacts" onClick={() => setOpen(false)}>Обсудить мероприятие</Link>
        </div>
      </aside>
    </div>
  );
}
