"use client";

import { useEffect } from "react";

export function ScrollEffects() {
  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -5%" },
      );
      revealNodes.forEach((node) => revealObserver.observe(node));
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target.id) return;
        links.forEach((link) => {
          const active = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-28% 0px -58%", threshold: [0.05, 0.2, 0.5] },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    const onScroll = () => document.body.classList.toggle("page-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const hero = document.querySelector<HTMLElement>(".hero");
    const move = (event: PointerEvent) => {
      if (!hero || window.innerWidth < 980 || reduced) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 5;
      hero.style.setProperty("--hero-x", `${x}px`);
      hero.style.setProperty("--hero-y", `${y}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return null;
}
