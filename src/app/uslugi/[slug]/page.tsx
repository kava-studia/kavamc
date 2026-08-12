import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

const serviceMedia: Record<string, { src: string; alt: string; position?: string }> = {
  "vedushchiy-na-svadbu": {
    src: "/media/wedding-bento.webp",
    alt: "MC KAVA ведёт свадьбу в банкетном зале",
  },
  "vedushchiy-na-korporativ": {
    src: "/media/corporate-bento.webp",
    alt: "MC KAVA проводит корпоративное мероприятие",
  },
  "organizatsiya-meropriyatiy": {
    src: "/media/backstage.webp",
    alt: "Подготовка и организация мероприятия KAVA MC",
    position: "50% 34%",
  },
  "club-mc": {
    src: "/media/club-wide.webp",
    alt: "KAVA MC работает на клубной сцене",
    position: "50% 42%",
  },
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  const image = serviceMedia[slug]?.src || "/media/og.webp";
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/uslugi/${service.slug}` },
    openGraph: { title: service.title, description: service.description, type: "website", images: [{ url: image }] },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const image = serviceMedia[slug] || serviceMedia["organizatsiya-meropriyatiy"];

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
          <nav className="bento-nav"><Link href="/eminem-tribute">Eminem Show</Link><Link href="/poleznoe">Полезное</Link><Link href="/referral">Реферальная программа</Link><Link href="/legal">Юридическое</Link></nav>
          <Link className="bento-header-cta" href="/#contacts">Проверить дату ↗</Link>
        </header>

        <section className="bento-service-hero">
          <div className="bento-service-hero-copy">
            <Link className="bento-back" href="/">← На главную</Link>
            <span className="bento-kicker">{service.eyebrow}</span>
            <h1>{service.title}</h1>
            <p>{service.lead}</p>
            <Link className="bento-service-hero-cta" href="/#contacts">Обсудить событие ↗</Link>
          </div>
          <div className="bento-service-hero-media">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 45vw"
              style={{ objectFit: "cover", objectPosition: image.position || "50% 50%" }}
            />
          </div>
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
              <p>Сначала фиксируем дату, город, площадку или её отсутствие, количество гостей и задачу события. После этого определяем формат работы, состав команды, бюджетный контур и следующий шаг.</p>
            </section>
          </article>
          <aside className="bento-article-side">
            <span className="bento-kicker">Связаться</span>
            <h3>Проверь дату до долгой переписки.</h3>
            <p>Напиши дату, город и тип события. Дальше спокойно разбираем формат, площадку и детали.</p>
            <Link href="/#contacts">Оставить заявку ↗</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
