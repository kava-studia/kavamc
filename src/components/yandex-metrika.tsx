"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_EVENT, COOKIE_STORAGE_KEY } from "@/components/cookie-consent";

type Consent = { choice?: "essential" | "all" };

function hasAnalyticsConsent() {
  try {
    const stored = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!stored) return false;
    return (JSON.parse(stored) as Consent).choice === "all";
  } catch {
    return false;
  }
}

export function YandexMetrika() {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(hasAnalyticsConsent());
    const onChange = () => setEnabled(hasAnalyticsConsent());
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  if (!id || !/^\d+$/.test(id) || !enabled) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${id},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
    </Script>
  );
}
