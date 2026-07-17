"use client";

import { useEffect, useRef, useState } from "react";
import { media } from "@/data/site";

type MediaItem = (typeof media)[number];

export function VideoGallery() {
  const [active, setActive] = useState<MediaItem | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.classList.toggle("modal-open", Boolean(active));
    if (active) window.setTimeout(() => videoRef.current?.play().catch(() => undefined), 120);
    return () => document.body.classList.remove("modal-open");
  }, [active]);

  return (
    <>
      <div className="media-grid">
        {media.map((item, index) => (
          <article className={`media-card media-${index + 1}`} key={item.id} data-reveal>
            <button className="media-poster" type="button" onClick={() => setActive(item)} style={{ backgroundImage: `linear-gradient(180deg, transparent 16%, rgba(0,0,0,.92)), url(${item.poster})` }} aria-label={`Смотреть ${item.title}`}>
              <span className="play"><span>▶</span></span>
              <span className="media-meta"><span>{item.type}</span><span>{item.duration}</span></span>
              <strong>{item.title}</strong><small>{item.venue}</small>
            </button>
          </article>
        ))}
      </div>

      {active && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label={active.title} onMouseDown={(event) => { if (event.currentTarget === event.target) setActive(null); }}>
          <div className="video-shell">
            <button className="modal-close" type="button" onClick={() => setActive(null)} aria-label="Закрыть видео">×</button>
            <video ref={videoRef} controls playsInline preload="metadata" poster={active.poster} src={active.videoUrl} />
            <div className="video-caption"><span>{active.type}</span><strong>{active.title}</strong><small>{active.venue} · {active.year}</small></div>
          </div>
        </div>
      )}
    </>
  );
}
