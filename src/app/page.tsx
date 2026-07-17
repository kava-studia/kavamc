import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { MobileMenu } from "@/components/mobile-menu";
import { VideoGallery } from "@/components/video-gallery";
import { formats, venues } from "@/data/site";

const telegram = "https://t.me/kava_studia";

type IconName = "arrow" | "play" | "mic" | "spark" | "event" | "guitar" | "home" | "grid" | "media" | "bolt";

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h13"/><path d="m14 7 5 5-5 5"/></>,
    play: <path d="m9 7 8 5-8 5V7Z"/>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></>,
    spark: <><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>,
    event: <><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/></>,
    guitar: <><path d="M14 5c2-2 5-1 5 2 0 2-2 3-4 3l-5 5"/><path d="M10 15c-2-2-5-1-5 2 0 3 4 5 7 2 2-2 1-4-2-4Z"/><path d="m15 6 3 3"/></>,
    home: <><path d="m4 11 8-7 8 7"/><path d="M6 10v10h12V10M10 20v-6h4v6"/></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></>,
    media: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3V9Z"/></>,
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Arrow() { return <Icon name="arrow" size={18} />; }

function Photo({ src, className = "", label, position }: { src: string; className?: string; label: string; position?: string }) {
  return (
    <div className={`photo ${className}`} style={{ backgroundImage: `linear-gradient(180deg, transparent 42%, rgba(4,5,10,.84)), url(${src})`, backgroundPosition: position }}>
      <span>{label}</span>
    </div>
  );
}

const services = [
  { icon: "mic" as IconName, title: "Клубный MC", text: "Работа поверх DJ-сета, точные выходы, драйв и живой контакт с танцполом." },
  { icon: "spark" as IconName, title: "Продюсер событий", text: "Концепция, программа, команда, артисты и продвижение в одном контуре." },
  { icon: "event" as IconName, title: "Частные события", text: "Свадьбы, корпоративы, открытия, презентации и городские мероприятия." },
  { icon: "guitar" as IconName, title: "Live Guitar Show", text: "Электроника, drum and bass, rock, metal, живая гитара и энергия сцены." },
];

const advantages = [
  ["01", "Чувствую зал", "Работаю по реакции людей, а не по заученному шаблону."],
  ["02", "Усиливаю DJ", "Не мешаю музыке, а точно поднимаю нужные моменты сета."],
  ["03", "Создаю контент", "Делаю живые сцены, которые гости снимают и публикуют сами."],
  ["04", "Держу стиль", "Без дешёвых конкурсов, давления и ощущения корпоративного ада."],
];

export default function Home() {
  return (
    <main className="home-page">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="KAVA MC - на главную">KAVA<span>MC</span></a>
        <nav aria-label="Основная навигация"><a href="#services">Возможности</a><a href="#formats">Форматы</a><a href="#video">Медиа</a><a href="#experience">Опыт</a><a href="#contacts">Контакты</a></nav>
        <a className="header-cta glass-action" href={telegram} target="_blank" rel="noreferrer">Забронировать дату <Arrow /></a>
        <MobileMenu />
      </header>

      <section className="hero" id="top">
        <Photo src="/media/hero.webp" className="hero-photo" label="KAVA MC · CLUB PERFORMANCE" position="70% center" />
        <div className="hero-grid-overlay" aria-hidden="true" />
        <div className="hero-content" data-reveal>
          <div className="hero-kicker"><span>Клубный MC</span><span>Ведущий событий</span><span>Event producer</span></div>
          <h1>KAVA <em>MC</em></h1>
          <p className="hero-tagline">Я не просто веду события.<br /><strong>Я создаю энергию, которую помнят.</strong></p>
          <div className="hero-actions">
            <a className="button button-primary glass-action" href={telegram} target="_blank" rel="noreferrer">Обсудить дату <Arrow /></a>
            <a className="button button-ghost glass-action" href="#video"><Icon name="play" size={18} /> Смотреть шоу-рил</a>
          </div>
          <div className="hero-social"><span>Москва · Россия</span><a href={telegram} target="_blank" rel="noreferrer">Telegram</a><a href="mailto:juri.kava@yandex.ru">Email</a></div>
        </div>
        <div className="hero-event-card glass-card" data-reveal>
          <span>Основной формат</span><strong>Клубный MC-сет</strong><p>Работа с DJ и залом</p><div><b>15 000 ₽</b><small>+ трансфер</small></div>
        </div>
        <div className="hero-rail" aria-hidden="true"><span>01</span><i /><span>ENERGY</span></div>
      </section>

      <section className="services-panel" id="services">
        <div className="compact-heading" data-reveal><div><p className="section-index">Что я делаю</p><h2>Больше,<br />чем <em>MC</em></h2></div><p>Харизма, контроль, импровизация и продюсерское мышление в каждом выходе.</p></div>
        <div className="service-grid">
          {services.map((service) => <article className="service-card glass-card" key={service.title} data-reveal><span className="service-icon"><Icon name={service.icon} /></span><div><h3>{service.title}</h3><p>{service.text}</p></div><Arrow /></article>)}
        </div>
      </section>

      <section className="advantages section-dark">
        <div className="advantages-intro" data-reveal><p className="section-index">Почему это работает</p><h2>Не фон.<br /><em>Катализатор.</em></h2><p>Я соединяю музыку, людей и момент так, чтобы вечер ощущался цельным, живым и дорогим.</p></div>
        <div className="advantage-grid">{advantages.map(([index, title, text]) => <article className="glass-card" key={index} data-reveal><span>{index}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="formats" id="formats">
        <div className="section-heading" data-reveal><div><p className="section-index">Форматы и стоимость</p><h2>Выбери<br /><em>уровень энергии</em></h2></div><p>От одного клубного выхода до полноценной серии событий. Всё адаптируется под площадку, музыку и аудиторию.</p></div>
        <div className="format-grid">
          {formats.map((format, index) => (
            <article className={`format-card glass-card ${"featured" in format && format.featured ? "featured" : ""}`} key={format.title} data-reveal>
              <div className="format-top"><span>0{index + 1}</span>{"featured" in format && format.featured ? <b>Флагман</b> : null}</div>
              <h3>{format.title}</h3><p className="format-price">{format.price}</p><p className="format-text">{format.text}</p>
              <div className="tags">{format.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a className="glass-action" href="#contacts">Выбрать формат <Arrow /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="visual-break">
        <Photo src="/media/club-wide.webp" className="visual-break-photo" label="CROWD · ENERGY · MOMENT" position="center" />
        <div className="visual-break-copy" data-reveal><p className="section-index">Работа с площадками</p><h2>DJ играет.<br /><em>Зал живёт.</em></h2><p>Разовый сет, серия пятниц, сезонная программа или резидентство. Я подстраиваюсь под музыкальную концепцию заведения и усиливаю её.</p><a className="button button-primary glass-action" href={telegram} target="_blank" rel="noreferrer">Обсудить сотрудничество <Arrow /></a></div>
      </section>

      <section className="video section-black" id="video">
        <div className="section-heading inverse" data-reveal><div><p className="section-index">Реальные выступления</p><h2>Смотри<br /><em>энергию</em></h2></div><p>Никаких стоков и выдуманных кейсов. Здесь реальные клубы, публика, сцена и работа в моменте.</p></div>
        <VideoGallery />
      </section>

      <section className="live-feature">
        <Photo src="/media/live-guitar.webp" className="live-feature-photo" label="LIVE GUITAR · ROCK · DNB" position="center" />
        <div className="live-feature-copy" data-reveal><span className="live-badge">Флагманское шоу</span><h2>KAVA MC<br /><em>+ Live Guitar</em></h2><p>Электронная музыка, drum and bass, rock, metal, живая гитара и голос, который держит сцену.</p><div className="live-price"><strong>30 000 ₽</strong><span>+ трансфер</span></div><a className="button button-primary glass-action" href={telegram} target="_blank" rel="noreferrer">Запросить live-формат <Arrow /></a></div>
      </section>

      <section className="experience" id="experience">
        <div className="experience-copy" data-reveal><p className="section-index">Опыт</p><h2>Восемь лет<br /><em>внутри индустрии</em></h2><p>Клубы, рестораны, свадьбы, корпоративы, городские события, открытия, презентации и продюсирование площадок.</p></div>
        <div className="experience-stats" data-reveal><div className="glass-card"><strong>8+</strong><span>лет опыта</span></div><div className="glass-card"><strong>3</strong><span>города в портфолио</span></div><div className="glass-card"><strong>6</strong><span>форматов работы</span></div></div>
        <div className="venue-list" data-reveal>{venues.map((venue) => <div className="glass-card" key={venue.city}><strong>{venue.city}</strong><span>{venue.names}</span></div>)}</div>
        <div className="experience-gallery"><Photo src="/media/backstage.webp" className="gallery-main" label="CHARACTER · LIGHT · MOMENT" position="center" /><Photo src="/media/private-event.webp" className="gallery-small" label="REAL PEOPLE · REAL REACTION" position="center" /></div>
      </section>

      <section className="process section-dark">
        <div className="compact-heading" data-reveal><div><p className="section-index">Как всё проходит</p><h2>От запроса<br /><em>до вау-эффекта</em></h2></div><p>Без бюрократии, бесконечных созвонов и хаоса. Понятный путь до сильного события.</p></div>
        <div className="process-grid">{["Запрос и дата", "Короткий бриф", "Музыка и задачи", "Подготовка", "Событие", "Повторные даты"].map((step, index) => <div className="process-step glass-card" key={step} data-reveal><span>0{index + 1}</span><h3>{step}</h3></div>)}</div>
      </section>

      <section className="contacts" id="contacts">
        <div className="contact-heading" data-reveal><p className="section-index">Бронирование</p><h2>Создадим<br /><em>что-то сильное?</em></h2><p className="contact-note">Оставь данные - форма соберёт сообщение и откроет Telegram. Ты увидишь текст перед отправкой.</p><div className="direct-contacts"><a className="glass-action" href={telegram} target="_blank" rel="noreferrer">Telegram · @kava_studia <Arrow /></a><a className="glass-action" href="mailto:juri.kava@yandex.ru">juri.kava@yandex.ru <Arrow /></a><a className="glass-action" href="tel:+79932542217">+7 993 254-22-17 <Arrow /></a></div></div>
        <ContactForm />
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">KAVA<span>MC</span></a>
        <div className="footer-center"><p>Клубный MC · ведущий · продюсер событий</p><div className="footer-legal"><Link href="/privacy">Конфиденциальность</Link><Link href="/consent">Согласие на обработку данных</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Условия использования</Link><Link href="/requisites">Контакты оператора</Link></div></div>
        <p>© {new Date().getFullYear()} KAVA MC</p>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Быстрые действия"><a href="#top"><Icon name="home" size={20} />Главная</a><a href="#formats"><Icon name="grid" size={20} />Форматы</a><a href="#video"><Icon name="media" size={20} />Медиа</a><a className="mobile-book" href={telegram} target="_blank" rel="noreferrer"><Icon name="bolt" size={20} />Забронировать</a></nav>
    </main>
  );
}
