import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { media } from "@/data/site";
import { links } from "@/data/links";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: "KAVA MC", url: "https://kavamc.vercel.app", inLanguage: "ru-RU" },
    {
      "@type": "Person",
      name: "MC KAVA",
      url: "https://kavamc.vercel.app",
      jobTitle: "Ведущий, организатор мероприятий и live-артист",
      telephone: links.phone,
      email: links.email,
      sameAs: [links.telegramChannel, links.vk, links.max],
      areaServed: ["Москва", "Московская область", "Сергиев Посад"],
    },
    {
      "@type": "ProfessionalService",
      name: "KAVA MC",
      url: "https://kavamc.vercel.app",
      description: "Проведение и организация мероприятий, live-шоу, свадьбы, корпоративы и клубные форматы.",
      areaServed: ["Москва", "Московская область", "Сергиев Посад"],
    },
  ],
};

function Arrow() { return <span aria-hidden="true">↗</span>; }

function MediaTile({ src, alt, position = "50% 50%", priority = false }: { src: string; alt: string; position?: string; priority?: boolean }) {
  return (
    <div className="bento-media">
      <Image src={src} alt={alt} fill priority={priority} unoptimized sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 40vw" style={{ objectFit: "cover", objectPosition: position }} />
    </div>
  );
}

function VideoTile({ index, label }: { index: number; label: string }) {
  const item = media[index];
  const portrait = item.orientation === "portrait";
  const silentWedding = item.id === "wedding";
  return (
    <article className={`bento-card bento-video-card ${portrait ? "bento-video-card-portrait" : "bento-video-card-landscape"}`}>
      <div className="bento-video-head">
        <div><span className="bento-kicker">{label}</span><h3>{item.title}</h3></div>
        <span className="bento-duration">{item.duration}</span>
      </div>
      <div className={`bento-video-frame ${portrait ? "bento-video-frame-portrait" : "bento-video-frame-landscape"}`}>
        <video controls playsInline preload="metadata" poster={item.poster} muted={silentWedding}>
          <source src={item.videoUrl} type="video/mp4" />
        </video>
      </div>
      <p>{item.venue}</p>
    </article>
  );
}

const faq = [
  ["Можно заказать только ведение?", "Да. Можно пригласить меня только как ведущего, отдельно заказать live-шоу или передать мне организацию события целиком."],
  ["Работаешь только в Сергиевом Посаде?", "Нет. Основная география — Сергиев Посад, Москва и Московская область. Другие города обсуждаются отдельно."],
  ["Какие сценические форматы можно пригласить?", "Eminem Live Tribute Show, Club Show MC и специальные сценические программы под конкретную площадку, корпоратив или событие."],
  ["Можно без конкурсов?", "Да. Я строю программу вокруг людей, атмосферы, юмора, музыки и живой реакции, а не вокруг обязательных конкурсов."],
];

export default function Home() {
  return (
    <main className="bento-page" id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="bento-header">
        <Link className="bento-logo" href="#top" aria-label="KAVA MC — главная">KAVA <span>MC</span></Link>
        <nav className="bento-nav" aria-label="Основная навигация">
          <Link href="/eminem-tribute">Eminem Show</Link><Link href="/poleznoe">Полезное</Link><Link href="/referral">Реферальная</Link><a href="#contacts">Контакты</a>
        </nav>
        <a className="bento-header-cta" href="#contacts">Обсудить дату <Arrow /></a>
      </header>

      <section className="bento-shell bento-grid bento-hero-grid" aria-label="KAVA MC">
        <article className="bento-card bento-hero-copy bento-span-7 bento-row-2">
          <div className="bento-pill">Организация · Ведение · Шоу</div>
          <div>
            <p className="bento-overline">MC KAVA · Москва · Московская область</p>
            <h1>Событие должно ощущаться <em>живым.</em></h1>
            <p className="bento-lead">Провожу свадьбы и корпоративы, собираю мероприятия под ключ и выступаю с отдельными сценическими программами.</p>
          </div>
          <div className="bento-actions">
            <Link className="bento-button bento-button-primary" href="/eminem-tribute">Eminem Live Tribute <Arrow /></Link>
            <a className="bento-button" href="#contacts">Проверить дату</a>
          </div>
        </article>

        <article className="bento-card bento-photo-card bento-span-5 bento-row-2"><MediaTile src="/media/hero.webp" alt="MC KAVA на мероприятии" priority position="64% 30%" /></article>

        <Link href="/eminem-tribute" className="bento-card bento-dark bento-span-8 bento-feature-card">
          <div className="bento-feature-copy">
            <span className="bento-kicker">Главное live-шоу</span><h2>Eminem Live<br />Tribute Show</h2>
            <p>Самостоятельная концертная программа для клубов, фестивалей, корпоративов и специальных событий.</p><strong>Открыть страницу шоу <Arrow /></strong>
          </div>
          <MediaTile src="/media/club-wide.webp" alt="Сцена и публика на выступлении MC KAVA" position="50% 42%" />
        </Link>

        <article className="bento-card bento-accent bento-span-4 bento-number-card"><span className="bento-kicker">Опыт</span><strong>8+</strong><p>лет в event-индустрии, на сцене и внутри реальных мероприятий</p></article>

        <Link href="/uslugi/vedushchiy-na-svadbu" className="bento-card bento-service-card bento-wedding-card bento-span-4">
          <MediaTile src="/media/wedding-final-2026.webp" alt="MC KAVA ведёт свадьбу в банкетном зале" position="50% 35%" />
          <div className="bento-service-copy"><span className="bento-kicker">Проведение</span><h3>Свадьбы</h3><p>Живое современное ведение, тайминг и импровизация без давления на гостей.</p><strong>Подробнее <Arrow /></strong></div>
        </Link>

        <Link href="/uslugi/vedushchiy-na-korporativ" className="bento-card bento-service-card bento-corporate-card bento-span-4">
          <MediaTile src="/media/corporate-final-2026.webp" alt="MC KAVA проводит корпоративное мероприятие" position="50% 57%" />
          <div className="bento-service-copy"><span className="bento-kicker">Проведение</span><h3>Корпоративы</h3><p>Программа под команду, музыкальные блоки и живой контакт с залом.</p><strong>Подробнее <Arrow /></strong></div>
        </Link>

        <Link href="/uslugi/organizatsiya-meropriyatiy" className="bento-card bento-service-card bento-production-card bento-span-4">
          <MediaTile src="/media/backstage.webp" alt="Подготовка и организация мероприятия" position="50% 32%" />
          <div className="bento-service-copy"><span className="bento-kicker">Под ключ</span><h3>Организация</h3><p>Площадка, команда, программа, техника, тайминг и контроль подготовки.</p><strong>Подробнее <Arrow /></strong></div>
        </Link>

        <article className="bento-card bento-span-7 bento-copy-card" id="about">
          <span className="bento-kicker">Что можно сделать вместе</span><h2>Провести. Организовать. Выступить.</h2>
          <div className="bento-steps">
            <div><span>01</span><strong>Ведущий</strong><p>Свадьбы, корпоративы, дни рождения, выпускные и частные события.</p></div>
            <div><span>02</span><strong>Организатор</strong><p>Собираю площадку, команду, программу и техническую часть в единый проект.</p></div>
            <div><span>03</span><strong>Шоу</strong><p>Eminem Tribute, Club Show MC и другие сценические программы.</p></div>
          </div>
        </article>

        <article className="bento-card bento-span-5 bento-quote-card"><span className="bento-kicker">Принцип</span><blockquote>«Не заставлять людей веселиться, а создать вечер, в который хочется включиться».</blockquote><p>Сценарий даёт опору. Люди дают настоящие моменты.</p></article>

        <div className="bento-span-6" id="video"><VideoTile index={0} label="Организация" /></div>
        <div className="bento-span-6"><VideoTile index={2} label="Живой зал" /></div>
        <div className="kava-extra-media bento-span-12"><div className="kava-extra-media-grid"><VideoTile index={3} label="Club Show MC" /><VideoTile index={4} label="Свадьба" /><VideoTile index={5} label="Корпоратив" /></div></div>

        <article className="bento-card bento-span-8 bento-useful-card">
          <div className="bento-useful-intro"><span className="bento-kicker">Полезное</span><h2>Организуешь сам? Держи нормальные материалы.</h2><p>Чек-листы по площадке, бюджету, подрядчикам, таймингу, технике и подготовке события.</p><Link className="bento-button" href="/poleznoe">Все материалы <Arrow /></Link></div>
          <div className="bento-useful-links"><Link href="/poleznoe/chek-list-podgotovki-meropriyatiya"><span>01</span><strong>Чек-лист подготовки мероприятия</strong><Arrow /></Link><Link href="/poleznoe/kak-vybrat-vedushego-na-svadbu"><span>02</span><strong>Как выбрать ведущего на свадьбу</strong><Arrow /></Link><Link href="/poleznoe/kak-vybrat-ploshadku-dlya-meropriyatiya"><span>03</span><strong>Как выбрать площадку</strong><Arrow /></Link></div>
        </article>

        <Link href="/referral" className="bento-card bento-referral-card bento-span-4"><span className="bento-kicker">Реферальная программа</span><h2>Рекомендуешь KAVA — получаешь вознаграждение.</h2><p>Условия фиксируем заранее и прозрачно.</p><strong>Как это работает <Arrow /></strong></Link>

        <a href={links.nado} target="_blank" rel="noreferrer" className="bento-card bento-partner-card bento-span-6"><span className="bento-kicker">Официальный партнёр KAVA MC</span><h2>NADO Праздник</h2><p>Через NADO Праздник можно организовать мероприятие или найти любых недостающих подрядчиков под вашу задачу.</p><strong>Открыть NADO Праздник <Arrow /></strong></a>

        <article className="bento-card bento-live-card bento-span-6"><span className="bento-kicker">Сценические программы</span><h2>Когда нужен не только ведущий.</h2><div className="bento-live-list"><span><b>Eminem Live Tribute</b><small>15–60 минут</small></span><span><b>Club Show MC</b><small>клубы и события</small></span><span><b>Специальные программы</b><small>под формат события</small></span></div></article>

        <article className="bento-card bento-channel-card bento-span-6"><span className="bento-kicker">KAVA Event</span><h2>Всё про свадьбы и мероприятия от KAVA MC.</h2><p>Полезные разборы, живые материалы, идеи и подготовка событий.</p><div className="bento-social-links"><a href={links.telegramChannel} target="_blank" rel="noreferrer">Telegram-канал <Arrow /></a><a href={links.vk} target="_blank" rel="noreferrer">Сообщество ВКонтакте <Arrow /></a></div></article>

        <article className="bento-card bento-social-card bento-span-6"><span className="bento-kicker">Связаться</span><h2>Написать напрямую.</h2><p>Для даты, предложения, площадки или вопроса по мероприятию.</p><div className="bento-social-links"><a href={links.telegram} target="_blank" rel="noreferrer">Telegram <Arrow /></a><a href={links.max} target="_blank" rel="noreferrer">MAX <Arrow /></a><a href={`tel:${links.phone}`}>{links.phoneLabel} <Arrow /></a></div></article>

        <article className="bento-card bento-span-5 bento-geo-card"><span className="bento-kicker">География</span><h2>Сергиев Посад<br />Москва<br />Московская область</h2><p>Другие города — по задаче, логистике и формату мероприятия.</p><Link href="/uslugi/club-mc">Club Show MC <Arrow /></Link></article>

        <article className="bento-card bento-span-7 bento-faq-card"><span className="bento-kicker">Коротко о главном</span><div className="bento-faq-list">{faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></article>
      </section>

      <section className="bento-shell bento-contact-section" id="contacts">
        <div className="bento-contact-copy"><span className="bento-kicker">Связь и booking</span><h2>Начнём с одного сообщения.</h2><p>Выбери тип события — Telegram откроется с готовой первой фразой. Без длинной анкеты.</p><div className="bento-contact-links"><a href={links.telegram} target="_blank" rel="noreferrer">Telegram · @{links.telegramUsername} <Arrow /></a><a href={links.max} target="_blank" rel="noreferrer">MAX <Arrow /></a><a href={`tel:${links.phone}`}>{links.phoneLabel} <Arrow /></a></div></div>
        <div className="bento-form-wrap"><ContactForm /></div>
      </section>

      <div className="bento-shell bento-legal-strip"><span>Юридическая информация и документы сайта</span><nav aria-label="Юридические документы"><Link href="/legal">Все документы</Link><Link href="/privacy">Персональные данные</Link><Link href="/cookies">Cookies</Link><Link href="/requisites">Контакты оператора</Link></nav></div>

      <footer className="bento-footer bento-shell"><Link className="bento-logo" href="#top">KAVA <span>MC</span></Link><p>Организация · Ведение · Шоу</p><div className="bento-footer-legal"><a href={links.telegramChannel} target="_blank" rel="noreferrer">KAVA Event</a><a href={links.vk} target="_blank" rel="noreferrer">VK</a><a href={links.telegram} target="_blank" rel="noreferrer">Telegram</a><a href={links.max} target="_blank" rel="noreferrer">MAX</a><Link href="/legal">Документы</Link></div></footer>
    </main>
  );
}
