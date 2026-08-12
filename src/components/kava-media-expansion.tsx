"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

function LocalVideo({
  title,
  label,
  venue,
  duration,
  poster,
  src,
  muted = false,
}: {
  title: string;
  label: string;
  venue: string;
  duration: string;
  poster: string;
  src: string;
  muted?: boolean;
}) {
  return (
    <article className="bento-card bento-video-card bento-video-card-portrait kava-extra-video-card">
      <div className="bento-video-head">
        <div>
          <span className="bento-kicker">{label}</span>
          <h3>{title}</h3>
        </div>
        <span className="bento-duration">{duration}</span>
      </div>
      <div className="bento-video-frame bento-video-frame-portrait">
        <video controls playsInline preload="metadata" poster={poster} muted={muted}>
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <p>{venue}</p>
    </article>
  );
}

function ServiceProof({ kind }: { kind: "wedding" | "corporate" }) {
  const wedding = kind === "wedding";
  return (
    <section className="kava-service-video-proof">
      <div className="kava-service-video-copy">
        <span className="bento-kicker">{wedding ? "СВАДЬБА · ВИДЕО" : "КОРПОРАТИВ · ВИДЕО"}</span>
        <h2>{wedding ? "Свадьба в движении." : "Корпоратив вживую."}</h2>
        <p>{wedding ? "Короткий рекламный ролик со свадьбы — люди, атмосфера и живая работа на событии." : "Реальный фрагмент корпоратива: команда, движение и атмосфера площадки."}</p>
      </div>
      <div className="kava-service-video-player">
        <LocalVideo
          title={wedding ? "Свадебный ролик" : "Корпоратив"}
          label={wedding ? "Свадьба" : "Корпоратив"}
          venue={wedding ? "Ведение и организация свадьбы" : "Команда · движение · атмосфера"}
          duration={wedding ? "00:18" : "00:10"}
          poster={wedding ? "/media/wedding-real-v2.webp" : "/media/corporate-real-v2.webp"}
          src={wedding ? "/media/wedding-event-720.mp4" : "/media/corporate-event-720.mp4"}
          muted={wedding}
        />
      </div>
    </section>
  );
}

export function KavaMediaExpansion() {
  const pathname = usePathname();
  const [serviceMount, setServiceMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const isWedding = pathname === "/uslugi/vedushchiy-na-svadbu";
    const isCorporate = pathname === "/uslugi/vedushchiy-na-korporativ";
    if (!isWedding && !isCorporate) {
      setServiceMount(null);
      return;
    }

    const hero = document.querySelector<HTMLElement>(".bento-service-hero");
    if (!hero) return;

    const mount = document.createElement("div");
    mount.className = "kava-service-video-mount";
    hero.insertAdjacentElement("afterend", mount);
    setServiceMount(mount);

    return () => {
      mount.remove();
      setServiceMount(null);
    };
  }, [pathname]);

  if (!serviceMount) return null;
  if (pathname === "/uslugi/vedushchiy-na-svadbu") return createPortal(<ServiceProof kind="wedding" />, serviceMount);
  if (pathname === "/uslugi/vedushchiy-na-korporativ") return createPortal(<ServiceProof kind="corporate" />, serviceMount);
  return null;
}
