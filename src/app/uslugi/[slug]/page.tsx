import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/uslugi/${service.slug}` },
    openGraph: { title: service.title, description: service.description, type: "website" },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: { "@type": "Person", name: "MC KAVA" },
    areaServed: ["Москва", "Московская область", "Сергиев Посад"],
    url: `https://kavamc.vercel.app/uslugi/${service.slug}`,
  };

  return (
    <main className="bento-subpage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="bento-subpage-shell">
        <header className="bento-header">
          <Link className="bento-logo" href="/">KAVA <span>MC</span></Link>
          <nav className="bento-nav"><Link href="/eminem-tribute">Eminem Show</Link><Link href="/poleznoe">Полезное</Link><Link href="/referral">Реферальная программа</Link></nav>
          <Link className="bento-header-cta" href="/#contacts">Проверить дату ↗</Link>
        </header>

        <section className="bento-subpage-head">
          <Link className="bento-back" href="/">← На главную</Link>
          <span className="bento-kicker">{service.eyebrow}</span>
          <h1>{service.title}</h1>
          <p>{service.lead}</p>
        </section>

        <div className="bento-article">
          <article className="bento-article-main">
            <section>
              <h2>Что входит</h2>
              <ul>{service.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </section>
            <section>
              <h2>Кому подходит</h2>
              <p>{service.who}</p>
            </section>
            <section>
              <h2>Как начинаем</h2>
              <p>Сначала коротко фиксируем дату, город, площадку или её отсутствие, количество гостей и задачу события. После этого можно предметно определить формат работы, состав команды и следующий шаг.</p>
            </section>
          </article>
          <aside className="bento-article-side">
            <span className="bento-kicker">Связаться</span>
            <h3>Проверь дату до долгой переписки.</h3>
            <p>Напиши дату, город и тип события. Если дата свободна, дальше уже спокойно разбираем детали.</p>
            <Link href="/#contacts">Оставить заявку ↗</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
