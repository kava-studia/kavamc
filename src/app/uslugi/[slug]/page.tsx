import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

const serviceMedia: Record<string, { src: string; alt: string; position?: string }> = {
  "vedushchiy-na-svadbu": {
    src: "/media/wedding-final-2026.webp",
    alt: "MC KAVA ведёт свадьбу в банкетном зале",
    position: "50% 35%",
  },
  "vedushchiy-na-korporativ": {
    src: "/media/corporate-final-2026.webp",
    alt: "MC KAVA проводит корпоративное мероприятие",
    position: "50% 57%",
  },
  "organizatsiya-meropriyatiy": {
    src: "/media/backstage.webp",
    alt: "Подготовка и организация мероприятия KAVA MC",
    position: "50% 32%",
  },
  "club-mc": {
    src: "/media/club-wide.webp",
    alt: "KAVA MC на клубной сцене",
    position: "50% 42%",
  },
};

const serviceVideo: Record<string, { src: string; poster: string; label: string; title: string; text: string; venue: string; duration: string; muted?: boolean }> = {
  "vedushchiy-na-svadbu": {
    src: "/media/wedding-event-1080-original.mp4",
    poster: "/media/wedding-final-2026.webp",
    label: "СВАДЬБА · ВИДЕО",
    title: "Свадьба в движении.",
    text: "Короткий рекламный ролик со свадьбы — люди, атмосфера и живая работа на событии.",
    venue: "Ведение и организация свадьбы",
    duration: "00:18",
    muted: true,
  },
  "vedushchiy-na-korporativ": {
    src: "/media/corporate-event-1080.mp4",
    poster: "/media/corporate-final-2026.webp",
    label: "КОРПОРАТИВ · ВИДЕО",
    title: "Корпоратив вживую.",
    text: "Реальный фрагмент корпоратива: команда, движение и атмосфера площадки.",
    venue: "Команда · движение · атмосфера",
    duration: "00:10",
  },
};

const displayCopy: Record<string, { title: string; lead: string; start: string }> = {
  "vedushchiy-na-svadbu": {
    title: "Ведущий на свадьбу",
    lead: "Живое современное ведение, понятный тайминг и импровизация без давления на гостей.",
    start: "Вы присылаете дату, город и примерный формат свадьбы. Созваниваемся, знакомимся и фиксируем следующий шаг.",
  },
  "vedushchiy-na-korporativ": {
    title: "Ведущий на корпоратив",
    lead: "Программа под вашу команду: нужный темп, музыкальные блоки, награждения и живой контакт с залом.",
    start: "Вы присылаете дату, город, количество гостей и задачу корпоратива. Дальше собираем подходящий формат программы.",
  },
  "organizatsiya-meropriyatiy": {
    title: "Организация мероприятий",
    lead: "Собираю площадку, подрядчиков, программу, технику и тайминг в один управляемый проект.",
    start: "Можно прийти просто с идеей, датой или бюджетом. Сначала определяем задачу, затем собираем смету и команду.",
  },
  "club-mc": {
    title: "Club Show MC",
    lead: "MC внутри музыки и реакции зала: работа поверх DJ-сета, специальные выходы и сценические блоки.",
    start: "Пришлите город, дату, площадку и формат вечера. Я предложу подходящую длительность и конфигурацию шоу.",
  },
};

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
  const visual = serviceMedia[service.slug];
  const video = serviceVideo[service.slug];
  const display = displayCopy[service.slug] ?? { title: service.title, lead: service.lead, start: "Сначала коротко обсуждаем задачу и фиксируем следующий шаг." };

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
          <nav className="bento-nav"><Link href="/eminem-tribute">Eminem Show</Link><Link href="/poleznoe">Полезное</Link><Link href="/referral">Реферальная</Link></nav>
          <Link className="bento-header-cta" href="/#contacts">Проверить дату ↗</Link>
        </header>

        <div className="bento-service-hero">
          <div className="bento-service-hero-copy">
            <Link className="bento-back" href="/">← На главную</Link>
            <span className="bento-kicker">{service.eyebrow}</span>
            <h1>{display.title}</h1>
            <p>{display.lead}</p>
            <Link className="bento-service-hero-cta" href="/#contacts">Обсудить событие ↗</Link>
          </div>
          <div className="bento-service-hero-media">
            <Image src={visual.src} alt={visual.alt} fill priority unoptimized sizes="(max-width: 820px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: visual.position ?? "50% 50%" }} />
          </div>
        </div>

        {video && (
          <section className="kava-service-video-proof">
            <div className="kava-service-video-copy"><span className="bento-kicker">{video.label}</span><h2>{video.title}</h2><p>{video.text}</p></div>
            <div className="kava-service-video-player">
              <article className="bento-card bento-video-card bento-video-card-portrait kava-extra-video-card">
                <div className="bento-video-head"><div><span className="bento-kicker">{service.eyebrow}</span><h3>{service.slug === "vedushchiy-na-svadbu" ? "Свадебный ролик" : "Корпоратив"}</h3></div><span className="bento-duration">{video.duration}</span></div>
                <div className="bento-video-frame bento-video-frame-portrait"><video controls playsInline preload="metadata" poster={video.poster} muted={video.muted ?? false}><source src={video.src} type="video/mp4" /></video></div>
                <p>{video.venue}</p>
              </article>
            </div>
          </section>
        )}

        <div className="bento-article bento-service-article">
          <article className="bento-article-main">
            <section><h2>Что входит</h2><ul>{service.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></section>
            <section><h2>Кому подходит</h2><p>{service.who}</p></section>
            <section><h2>Как начинаем</h2><p>{display.start}</p></section>
          </article>
          <aside className="bento-article-side"><span className="bento-kicker">Связаться</span><h3>Проверим дату и задачу.</h3><p>Дальше спокойно собираем формат, программу и детали.</p><Link href="/#contacts">Написать KAVA MC ↗</Link></aside>
        </div>
      </div>
    </main>
  );
}
