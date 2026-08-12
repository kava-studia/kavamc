"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { links } from "@/data/links";

const menuLinks = [
  ["Eminem Live Tribute", "/eminem-tribute"],
  ["Свадьбы", "/uslugi/vedushchiy-na-svadbu"],
  ["Корпоративы", "/uslugi/vedushchiy-na-korporativ"],
  ["Организация", "/uslugi/organizatsiya-meropriyatiy"],
  ["Club Show MC", "/uslugi/club-mc"],
  ["Полезное", "/poleznoe"],
  ["Реферальная программа", "/referral"],
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
          {menuLinks.map(([label, href], index) => (
            <Link href={href} onClick={() => setOpen(false)} key={href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </nav>
        <div className="bento-menu-contacts">
          <a href={links.telegramChannel} target="_blank" rel="noreferrer">KAVA Event · канал ↗</a>
          <a href={links.vk} target="_blank" rel="noreferrer">Сообщество VK ↗</a>
          <a href={links.telegram} target="_blank" rel="noreferrer">Написать в Telegram ↗</a>
          <a href={links.max} target="_blank" rel="noreferrer">Написать в MAX ↗</a>
          <Link href="/#contacts" onClick={() => setOpen(false)}>Обсудить мероприятие</Link>
        </div>
      </aside>
    </div>
  );
}
