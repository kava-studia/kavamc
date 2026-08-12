import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/data/content";

export const metadata: Metadata = {
  title: "Полезное об организации мероприятий",
  description: "Практические материалы MC KAVA о свадьбах, корпоративах, выборе ведущего, площадки, тайминге и самостоятельной организации мероприятий.",
  alternates: { canonical: "/poleznoe" },
};

export default function UsefulPage() {
  return (
    <main className="bento-subpage">
      <div className="bento-subpage-shell">
        <header className="bento-header">
          <Link className="bento-logo" href="/">KAVA <span>MC</span></Link>
          <nav className="bento-nav"><Link href="/eminem-tribute">Eminem Show</Link><Link href="/referral">Реферальная программа</Link><Link href="/legal">Юридическое</Link><Link href="/#contacts">Контакты</Link></nav>
          <Link className="bento-header-cta" href="/#contacts">Обсудить событие ↗</Link>
        </header>

        <section className="bento-subpage-head">
          <Link className="bento-back" href="/">← На главную</Link>
          <span className="bento-kicker">Полезное</span>
          <h1>Организовать хорошо проще, когда понимаешь, что проверять.</h1>
          <p>Конкретные рабочие материалы без регистрации и без «оставьте номер, чтобы получить PDF»: площадка, бюджет, команда, тайминг, техника и программа.</p>
        </section>

        <section className="bento-list-grid" aria-label="Полезные материалы">
          <Link className="bento-list-card" href="/poleznoe/chek-list-podgotovki-meropriyatiya">
            <span className="bento-kicker">Главный чек-лист</span>
            <h2>Чек-лист подготовки мероприятия без хаоса</h2>
            <p>Универсальный план для свадьбы, корпоратива или частного события: от задачи и сметы до технической проверки и контрольного созвона за 72 часа.</p>
            <strong>Открыть чек-лист ↗</strong>
          </Link>
          {guides.map((guide) => (
            <Link className="bento-list-card" href={`/poleznoe/${guide.slug}`} key={guide.slug}>
              <span className="bento-kicker">{guide.eyebrow}</span>
              <h2>{guide.title}</h2>
              <p>{guide.description}</p>
              <strong>Читать ↗</strong>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
