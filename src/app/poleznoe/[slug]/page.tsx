import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/poleznoe/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.description, type: "article" },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    author: { "@type": "Person", name: "MC KAVA" },
    publisher: { "@type": "Organization", name: "KAVA MC" },
    mainEntityOfPage: `https://kavamc.vercel.app/poleznoe/${guide.slug}`,
    inLanguage: "ru-RU",
  };

  return (
    <main className="bento-subpage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="bento-subpage-shell">
        <header className="bento-header">
          <Link className="bento-logo" href="/">KAVA <span>MC</span></Link>
          <nav className="bento-nav"><Link href="/poleznoe">Все материалы</Link><Link href="/eminem-tribute">Eminem Show</Link><Link href="/#contacts">Контакты</Link></nav>
          <Link className="bento-header-cta" href="/#contacts">Обсудить событие ↗</Link>
        </header>

        <section className="bento-subpage-head">
          <Link className="bento-back" href="/poleznoe">← Все материалы</Link>
          <span className="bento-kicker">{guide.eyebrow}</span>
          <h1>{guide.title}</h1>
          <p>{guide.intro}</p>
        </section>

        <div className="bento-article">
          <article className="bento-article-main">
            {guide.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
                {section.points ? <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
              </section>
            ))}
          </article>
          <aside className="bento-article-side">
            <span className="bento-kicker">Нужна помощь?</span>
            <h3>Можно не собирать всё самостоятельно.</h3>
            <p>Расскажи дату, город и задачу. Я помогу понять, какой формат работы нужен и с чего начать.</p>
            <Link href="/#contacts">Написать MC KAVA ↗</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
