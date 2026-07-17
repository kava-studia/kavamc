"use client";

import { useEffect, useState } from "react";

export function SiteControls() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setVisible(scrollTop > 520);
      setProgress(Math.min(100, Math.max(0, (scrollTop / max) * 100)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <div className="reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <button
        type="button"
        className={`back-to-top ${visible ? "is-visible" : ""}`}
        aria-label="Вернуться наверх"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <span>↑</span>
        <small>Наверх</small>
      </button>
    </>
  );
}
