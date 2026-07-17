import Link from "next/link";
import { ReactNode } from "react";
import { legal } from "@/data/legal";

export function LegalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link className="brand" href="/">KAVA<span>MC</span></Link>
        <Link className="legal-back" href="/">← Вернуться на сайт</Link>
      </header>
      <article className="legal-document">
        <p className="section-index">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="legal-intro">{intro}</p>
        <div className="legal-meta"><span>Редакция от {legal.updated}</span><span>Оператор · {legal.operator}</span></div>
        <div className="legal-content">{children}</div>
      </article>
      <footer className="legal-footer">
        <Link href="/privacy">Конфиденциальность</Link><Link href="/consent">Согласие</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Условия</Link><Link href="/requisites">Контакты оператора</Link>
      </footer>
    </main>
  );
}
