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
  const [homeMount, setHomeMount] = useState<HTMLElement | null>(null);
  const [serviceMount, setServiceMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let createdHome: HTMLElement | null = null;
    let createdService: HTMLElement | null = null;

    if (pathname === "/") {
      const cards = Array.from(document.querySelectorAll<HTMLElement>(".bento-video-card"));
      const firstKicker = cards[0]?.querySelector<HTMLElement>(".bento-kicker");
      if (firstKicker) firstKicker.textContent = "Организация";

      const secondCard = cards[1];
      const anchor = secondCard?.parentElement;
      const grid = anchor?.parentElement;
      if (anchor && grid) {
        createdHome = document.createElement("div");
        createdHome.className = "kava-extra-media bento-span-12";
        anchor.insertAdjacentElement("afterend", createdHome);
        setHomeMount(createdHome);
      }

      const weddingImg = document.querySelector<HTMLImageElement>(".bento-wedding-card .bento-media img");
      const corporateImg = document.querySelector<HTMLImageElement>(".bento-corporate-card .bento-media img");
      if (weddingImg) {
        weddingImg.src = "/media/wedding-real-v2.webp";
        weddingImg.style.opacity = "1";
        weddingImg.style.visibility = "visible";
      }
      if (corporateImg) {
        corporateImg.src = "/media/corporate-real-v2.webp";
        corporateImg.style.opacity = "1";
        corporateImg.style.visibility = "visible";
      }
    }

    const isWedding = pathname === "/uslugi/vedushchiy-na-svadbu";
    const isCorporate = pathname === "/uslugi/vedushchiy-na-korporativ";
    if (isWedding || isCorporate) {
      const hero = document.querySelector<HTMLElement>(".bento-service-hero");
      const shell = hero?.parentElement;
      const media = hero?.querySelector<HTMLElement>(".bento-service-hero-media");
      const src = isWedding ? "/media/wedding-real-v2.webp" : "/media/corporate-real-v2.webp";
      if (media) {
        media.style.backgroundImage = `url('${src}')`;
        media.style.backgroundSize = "cover";
        media.style.backgroundPosition = isWedding ? "50% 42%" : "50% 43%";
        media.style.backgroundRepeat = "no-repeat";
        const image = media.querySelector<HTMLImageElement>("img");
        if (image) {
          image.src = src;
          image.style.opacity = "1";
          image.style.visibility = "visible";
        }
      }
      if (hero && shell) {
        createdService = document.createElement("div");
        createdService.className = "kava-service-video-mount";
        hero.insertAdjacentElement("afterend", createdService);
        setServiceMount(createdService);
      }
    }

    return () => {
      createdHome?.remove();
      createdService?.remove();
      setHomeMount(null);
      setServiceMount(null);
    };
  }, [pathname]);

  return (
    <>
      {homeMount && createPortal(
        <div className="kava-extra-media-grid">
          <LocalVideo
            title="Sorry Mama"
            label="Club Show MC"
            venue="Клубная энергия · живой выход"
            duration="00:14"
            poster="/media/poster-sorry.webp"
            src="/media/sorry-mama-hd.mp4"
          />
          <LocalVideo
            title="Свадебный ролик"
            label="Свадьба"
            venue="Ведение и организация свадьбы"
            duration="00:18"
            poster="/media/wedding-real-v2.webp"
            src="/media/wedding-event-720.mp4"
            muted
          />
          <LocalVideo
            title="Корпоратив"
            label="Корпоратив"
            venue="Команда · движение · атмосфера"
            duration="00:10"
            poster="/media/corporate-real-v2.webp"
            src="/media/corporate-event-720.mp4"
          />
        </div>,
        homeMount,
      )}
      {serviceMount && pathname === "/uslugi/vedushchiy-na-svadbu" && createPortal(<ServiceProof kind="wedding" />, serviceMount)}
      {serviceMount && pathname === "/uslugi/vedushchiy-na-korporativ" && createPortal(<ServiceProof kind="corporate" />, serviceMount)}
    </>
  );
}
