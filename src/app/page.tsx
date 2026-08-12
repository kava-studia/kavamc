import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { media } from "@/data/site";
import { links } from "@/data/links";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "KAVA MC",
      url: "https://kavamc.vercel.app",
      inLanguage: "ru-RU",
    },
    {
      "@type": "Person",
      name: "MC KAVA",
      url: "https://kavamc.vercel.app",
      jobTitle: "Ведущий, организатор мероприятий и live-артист",
      telephone: links.phone,
      email: links.email,
      sameAs: [links.telegram, links.vk, links.max],
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

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function MediaTile({
  src,
  alt,
  className = "",
  position = "50% 50%",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  position?: string;
  priority?: boolean;
}) {
  return (
    <div className={`bento-media ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 40vw"
        style={{ objectFit: "cover", objectPosition: position }}
      />
    </div>
  );
}

function VideoTile({ index, label }: { index: number; label: string }) {
  const item = media[index];
  return (
    <article className="bento-card bento-video-card">
      <div className="bento-video-head">
        <div>
          <span className="bento-kicker">{label}</span>
          <h3>{item.title}</h3>
        </div>
        <span className="bento-duration">{item.duration}</span>
      </div>
      <div className="bento-video-frame">
        <video controls playsInline preload="metadata" poster={item.poster}>
          <source src={item.videoUrl} type="video/mp4" />
        </video>
      </div>
      <p>{item.venue}</p>
    </article>
  );
}

const faq = [
  ["Можно заказать только ведение?", "Да. Можно пригласить меня только как ведущего, отдельно заказать live-шоу или передать мне организацию события целиком."],
  ["Работаешь только в Сергиевом Посаде?", "Нет. Основная география - Сергиев Посад, Москва и Московская область. Другие города обсуждаются отдельно."],
  ["Какие live-форматы можно пригласить?", "Eminem Live Tribute Show, Club MC и специальные сценические форматы под конкретную площадку, корпоратив или событие."],
  ["Можно без конкурсов?", "Можно. Я строю программу вокруг людей, атмосферы, юмора, музыки и живой реакции, а не вокруг обязательных конкурсов."],
];

export default function Home() {
  return (
    <main className="bento-page" id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="bento-header">
        <Link className="bento-logo" href="#top" aria-label="KAVA MC - главная">
          KAVA <span>MC</span>
        </Link>
        <nav className="bento-nav" aria-label="Основная навигация">
          <Link href="/eminem-tribute">Eminem Show</Link>
          <Link href="/poleznoe">Полезное</Link>
          <Link href="/referral">Реферальная</Link>
          <Link href="/legal">Юридическое</Link>
          <a href="#contacts">Контакты</a>
        </nav>
        <a className="bento-header-cta" href="#contacts">Обсудить дату <Arrow /></a>
      </header>

      <section className="bento-shell bento-grid bento-hero-grid" aria-label="KAVA MC">
        <article className="bento-card bento-hero-copy bento-span-7 bento-row-2">
          <div className="bento-pill">Организация · Ведение · Шоу</div>
          <div>
            <p className="bento-overline">MC KAVA · Москва · Московская область</p>
            <h1>Событие должно ощущаться <em>живым.</em></h1>
            <p className="bento-lead">Я веду свадьбы и корпоративы, собираю мероприятия под ключ и выступаю с отдельными live-шоу. Один человек держит идею, программу, команду и атмосферу в одном контуре.</p>
          </div>
          <div className="bento-actions">
            <Link className="bento-button bento-button-primary" href="/eminem-tribute">Eminem Live Tribute <Arrow /></Link>
            <a className="bento-button" href="#contacts">Проверить дату</a>
          </div>
        </article>

        <article className="bento-card bento-photo-card bento-span-5 bento-row-2">
          <MediaTile src="/media/hero.webp" alt="MC KAVA на мероприятии" priority position="64% 30%" />
          <div className="bento-photo-caption"><span>ARTIST</span><span>HOST</span><span>PRODUCER</span></div>
        </article>

        <Link href="/eminem-tribute" className="bento-card bento-dark bento-span-8 bento-feature-card">
          <div className="bento-feature-copy">
            <span className="bento-kicker">Live show</span>
            <h2>Eminem Live<br />Tribute Show</h2>
            <p>Самостоятельная концертная программа для клубов, фестивалей, корпоративов и специальных событий.</p>
            <strong>Открыть страницу шоу <Arrow /></strong>
          </div>
          <MediaTile src="/media/club-wide.webp" alt="Сцена и публика на клубном выступлении MC KAVA" position="50% 42%" />
        </Link>

        <article className="bento-card bento-accent bento-span-4 bento-number-card">
          <span className="bento-kicker">Опыт</span>
          <strong>8+</strong>
          <p>лет в event-индустрии, на сцене и внутри реальных мероприятий</p>
        </article>

        <Link href="/uslugi/vedushchiy-na-svadbu" className="bento-card bento-service-card bento-wedding-card bento-span-4">
          <MediaTile src="/media/wedding-bento.webp" alt="MC KAVA ведёт свадьбу в банкетном зале" />
          <div className="bento-service-copy"><span className="bento-kicker">Проведение</span><h3>Свадьбы</h3><p>Современное ведение, тайминг, импровизация и работа с гостями без давления.</p><strong>Подробнее <Arrow /></strong></div>
        </Link>

        <Link href="/uslugi/vedushchiy-na-korporativ" className="bento-card bento-service-card bento-corporate-card bento-span-4">
          <MediaTile src="/media/corporate-bento.webp" alt="MC KAVA проводит корпоративное мероприятие с командой" />
          <div className="bento-service-copy"><span className="bento-kicker">Проведение</span><h3>Корпоративы</h3><p>Программа под компанию, музыкальные блоки и живой контакт с аудиторией.</p><strong>Подробнее <Arrow /></strong></div>
        </Link>

        <Link href="/uslugi/organizatsiya-meropriyatiy" className="bento-card bento-service-card bento-production-card bento-span-4">
          <MediaTile src="/media/backstage.webp" alt="Подготовка и организация мероприятия" position="50% 32%" />
          <div className="bento-service-copy"><span className="bento-kicker">Под ключ</span><h3>Организация</h3><p>Площадка, подрядчики, программа, техника, тайминг и контроль договорённостей.</p><strong>Подробнее <Arrow /></strong></div>
        </Link>

        <article className="bento-card bento-span-7 bento-copy-card" id="about">
          <span className="bento-kicker">Три способа работать со мной</span>
          <h2>Выступи. Проведи. Организуй.</h2>
          <div className="bento-steps">
            <div><span>01</span><strong>Шоу</strong><p>Eminem Tribute, Club Show и специальные сценические форматы.</p></div>
            <div><span>02</span><strong>Ведущий</strong><p>Свадьбы, корпоративы, дни рождения, выпускные и частные события.</p></div>
            <div><span>03</span><strong>Организатор</strong><p>Собираю мероприятие целиком и держу общий процесс в одном контуре.</p></div>
          </div>
        </article>

        <article className="bento-card bento-span-5 bento-quote-card">
          <span className="bento-kicker">Принцип</span>
          <blockquote>«Никого не нужно заставлять веселиться. Нужно создать среду, в которой людям самим хочется включиться».</blockquote>
          <p>Сценарий даёт опору. Люди дают настоящие моменты.</p>
        </article>

        <div className="bento-span-7" id="video"><VideoTile index={0} label="Showreel" /></div>
        <div className="bento-span-5"><VideoTile index={2} label="Живой зал" /></div>

        <article className="bento-card bento-span-8 bento-useful-card">
          <div className="bento-useful-intro">
            <span className="bento-kicker">Полезное</span>
            <h2>Организуешь сам? Держи нормальные инструменты.</h2>
            <p>Практические чек-листы по площадке, бюджету, подрядчикам, таймингу, технике и подготовке события.</p>
            <Link className="bento-button" href="/poleznoe">Все материалы <Arrow /></Link>
          </div>
          <div className="bento-useful-links">
            <Link href="/poleznoe/chek-list-podgotovki-meropriyatiya"><span>01</span><strong>Чек-лист подготовки мероприятия</strong><Arrow /></Link>
            <Link href="/poleznoe/kak-vybrat-vedushego-na-svadbu"><span>02</span><strong>Как выбрать ведущего на свадьбу</strong><Arrow /></Link>
            <Link href="/poleznoe/kak-vybrat-ploshadku-dlya-meropriyatiya"><span>03</span><strong>Как выбрать площадку</strong><Arrow /></Link>
          </div>
        </article>

        <Link href="/referral" className="bento-card bento-referral-card bento-span-4">
          <span className="bento-kicker">Реферальная программа</span>
          <h2>Знаешь человека, которому нужен KAVA?</h2>
          <p>Передай контакт или познакомь нас. Условия вознаграждения фиксируем заранее и прозрачно.</p>
          <strong>Как это работает <Arrow /></strong>
        </Link>

        <a href={links.nado} target="_blank" rel="noreferrer" className="bento-card bento-partner-card bento-span-7">
          <span className="bento-kicker">Официальный партнёр</span>
          <h2>NADO Праздник</h2>
          <p>Партнёрская event-платформа с большой базой площадок и подрядчиков на разные задачи и бюджеты. Это расширяет возможности KAVA MC: можно собрать команду под конкретную идею, найти нужных специалистов и воплотить нестандартный формат без привязки к одному набору исполнителей.</p>
          <strong>Открыть NADO Праздник <Arrow /></strong>
        </a>

        <article className="bento-card bento-live-card bento-span-5">
          <span className="bento-kicker">Live направление</span>
          <h2>Сцена не заканчивается микрофоном ведущего.</h2>
          <p>KAVA MC объединяет ведение и самостоятельные сценические программы: от клубной работы до полноценного рэп-трибьют шоу.</p>
          <div className="bento-live-list">
            <span><b>Eminem Live Tribute</b><small>60 / 45 / 30 / 15 мин</small></span>
            <span><b>Club MC</b><small>клубы и события</small></span>
            <span><b>Special Live Sets</b><small>под площадку</small></span>
          </div>
        </article>

        <article className="bento-card bento-social-card bento-span-5">
          <span className="bento-kicker">Соцсети и связь</span>
          <h2>Где следить за KAVA MC</h2>
          <p>Анонсы, новые видео, backstage, полезные материалы и свободные даты.</p>
          <div className="bento-social-links">
            <a href={links.telegram} target="_blank" rel="noreferrer">Telegram ↗</a>
            <a href={links.vk} target="_blank" rel="noreferrer">ВКонтакте ↗</a>
            <a href={links.max} target="_blank" rel="noreferrer">MAX ↗</a>
          </div>
        </article>

        <article className="bento-card bento-checklist-card bento-span-3">
          <span className="bento-kicker">Бесплатно</span>
          <h2>Чек-лист мероприятия</h2>
          <p>Площадка, бюджет, команда, тайминг, техника, документы и контрольный прогон перед датой.</p>
          <Link href="/poleznoe/chek-list-podgotovki-meropriyatiya">Открыть чек-лист <Arrow /></Link>
        </article>

        <Link href="/legal" className="bento-card bento-legal-card bento-span-4">
          <span className="bento-kicker">Юридическая информация</span>
          <h2>Документы сайта - в одном разделе.</h2>
          <p>Политика обработки данных, согласие, cookies, условия использования, контакты оператора и правила реферальной программы.</p>
          <strong>Открыть юридический раздел <Arrow /></strong>
        </Link>

        <article className="bento-card bento-span-5 bento-geo-card">
          <span className="bento-kicker">География</span>
          <h2>Сергиев Посад<br />Москва<br />Московская область</h2>
          <p>Другие города - по задаче, логистике и формату мероприятия.</p>
          <Link href="/uslugi/club-mc">Клубные форматы <Arrow /></Link>
        </article>

        <article className="bento-card bento-span-7 bento-faq-card">
          <span className="bento-kicker">Коротко о главном</span>
          <div className="bento-faq-list">
            {faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
          </div>
        </article>
      </section>

      <section className="bento-shell bento-contact-section" id="contacts">
        <div className="bento-contact-copy">
          <span className="bento-kicker">Booking и мероприятия</span>
          <h2>Расскажи, что хочешь сделать.</h2>
          <p>Шоу, свадьба, корпоратив или полная организация. Можно прийти даже с одной идеей - разложим её на площадку, команду, программу, технику и бюджет.</p>
          <div className="bento-contact-links">
            <a href={links.telegram} target="_blank" rel="noreferrer">Telegram · @kava_event <Arrow /></a>
            <a href={links.vk} target="_blank" rel="noreferrer">ВКонтакте · kava_studia <Arrow /></a>
            <a href={links.max} target="_blank" rel="noreferrer">MAX <Arrow /></a>
            <a href={`tel:${links.phone}`}>{links.phoneLabel} <Arrow /></a>
            <a href={`mailto:${links.email}`}>{links.email} <Arrow /></a>
          </div>
        </div>
        <div className="bento-form-wrap"><ContactForm /></div>
      </section>

      <footer className="bento-footer bento-shell">
        <Link className="bento-logo" href="#top">KAVA <span>MC</span></Link>
        <p>Организация · Ведение · Шоу</p>
        <div className="bento-footer-legal">
          <Link href="/poleznoe">Полезное</Link>
          <Link href="/referral">Реферальная программа</Link>
          <Link href="/legal">Юридическая информация</Link>
          <Link href="/privacy">Политика ПДн</Link>
          <Link href="/consent">Согласие</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/terms">Условия сайта</Link>
          <Link href="/requisites">Контакты оператора</Link>
          <a href={links.telegram} target="_blank" rel="noreferrer">Telegram</a>
          <a href={links.vk} target="_blank" rel="noreferrer">VK</a>
          <a href={links.max} target="_blank" rel="noreferrer">MAX</a>
        </div>
      </footer>
    </main>
  );
}
