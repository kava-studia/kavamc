import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { MobileMenu } from "@/components/mobile-menu";
import { VideoGallery } from "@/components/video-gallery";
import { formats, venues } from "@/data/site";

const telegram = "https://t.me/kava_studia";

type IconName = "arrow" | "play" | "mic" | "spark" | "event" | "guitar" | "home" | "grid" | "media" | "bolt" | "check";

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
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Arrow() { return <Icon name="arrow" size={18} />; }

function Photo({ src, className = "", label, position }: { src: string; className?: string; label: string; position?: string }) {
  return <div className={`photo ${className}`} style={{ backgroundImage: `linear-gradient(180deg, transparent 42%, rgba(4,5,10,.84)), url(${src})`, backgroundPosition: position }}><span>{label}</span></div>;
}

const included = [
  "Сценарная логика и драматургия вечера",
  "Работа с DJ, артистами и технической командой",
  "Контакт с залом без навязчивых конкурсов",
  "Объявления, импровизация и партнёрские интеграции",
  "Создание моментов для фото и видео",
  "Подготовка под конкретную площадку и аудиторию",
];

const collaboration = [
  { n: "01", title: "Один сильный выход", text: "Клубный сет, открытие, презентация или частное событие.", cta: "Выбрать дату" },
  { n: "02", title: "Серия событий", text: "Регулярные пятницы, субботы, сезонные программы и тематические ночи.", cta: "Обсудить серию" },
  { n: "03", title: "Продюсирование под ключ", text: "Концепция, команда, артисты, продвижение и контроль реализации.", cta: "Собрать проект" },
];

export default function Home() {
  return (
    <main className="home-page night-architecture">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="KAVA MC - на главную">KAVA<span>MC</span></a>
        <nav aria-label="Основная навигация"><a href="#formats">Форматы</a><a href="#included">Что входит</a><a href="#video">Видео</a><a href="#experience">Опыт</a><a href="#contacts">Контакты</a></nav>
        <a className="header-cta glass-action" href={telegram} target="_blank" rel="noreferrer">Обсудить задачу <Arrow /></a>
        <MobileMenu />
      </header>

      <section className="hero ns-hero" id="top">
        <Photo src="/media/hero.webp" className="hero-photo" label="KAVA MC · LIVE ENERGY" position="70% center" />
        <div className="ns-hero-copy" data-reveal>
          <p className="eyebrow">Клубный MC · ведущий · продюсер событий</p>
          <h1>Голос,<br />который <em>двигает</em><br />вечер</h1>
          <p className="hero-tagline">Создаю события, в которых музыка, люди и момент работают как единое целое.</p>
          <div className="hero-actions"><a className="button button-primary" href={telegram} target="_blank" rel="noreferrer">Обсудить задачу <Arrow /></a><a className="button button-ghost" href="#video"><Icon name="play" size={18}/> Смотреть выступления</a></div>
        </div>
        <div className="hero-facts" data-reveal><div><strong>8+</strong><span>лет в индустрии</span></div><div><strong>6</strong><span>форматов работы</span></div><div><strong>3</strong><span>города в портфолио</span></div></div>
      </section>

      <div className="marquee" aria-hidden="true"><div>KAVA MC · CLUB SET · LIVE GUITAR · EVENT PRODUCTION · PRIVATE EVENTS · KAVA MC · CLUB SET · LIVE GUITAR · EVENT PRODUCTION · PRIVATE EVENTS ·</div></div>

      <section className="catalog" id="formats">
        <div className="catalog-head" data-reveal><p className="eyebrow">Форматы</p><h2>Выбирай не услугу.<br /><em>Выбирай энергию.</em></h2><p>От одного клубного выхода до полного продюсирования события.</p></div>
        <div className="catalog-grid">
          {formats.map((format, index) => {
            const images = ["/media/club-wide.webp", "/media/live-guitar.webp", "/media/backstage.webp", "/media/private-event.webp", "/media/hero.webp", "/media/club-wide.webp"];
            return <article className={`catalog-card ${"featured" in format && format.featured ? "featured" : ""}`} key={format.title} data-reveal>
              <div className="catalog-card-image" style={{ backgroundImage: `linear-gradient(180deg,transparent 20%,rgba(5,7,11,.94)),url(${images[index]})` }}><span>0{index + 1}</span>{"featured" in format && format.featured ? <b>Флагман</b> : null}</div>
              <div className="catalog-card-body"><h3>{format.title}</h3><strong>{format.price}</strong><p>{format.text}</p><div className="tags">{format.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a href="#contacts">Выбрать формат <Arrow /></a></div>
            </article>;
          })}
        </div>
      </section>

      <section className="included" id="included">
        <div className="included-title" data-reveal><p className="eyebrow">Что входит в работу</p><h2>Не просто<br /><em>микрофон.</em></h2><p>Я собираю вечер как систему - музыка, темп, коммуникация, сцена и контент.</p></div>
        <div className="included-list">{included.map((item, index) => <div key={item} data-reveal><span>0{index + 1}</span><strong>{item}</strong><Icon name="check" size={22}/></div>)}</div>
      </section>

      <section className="collaboration">
        <div className="section-head" data-reveal><p className="eyebrow">Механики сотрудничества</p><h2>Один артист.<br /><em>Три масштаба.</em></h2></div>
        <div className="collaboration-grid">{collaboration.map(item => <article key={item.n} data-reveal><span>{item.n}</span><h3>{item.title}</h3><p>{item.text}</p><a href="#contacts">{item.cta} <Arrow /></a></article>)}</div>
      </section>

      <section className="visual-break ns-break"><Photo src="/media/private-event.webp" className="visual-break-photo" label="REAL PEOPLE · REAL MOMENT" position="center"/><div className="visual-break-copy" data-reveal><p className="eyebrow">Для площадок и брендов</p><h2>Событие должно<br /><em>работать на вас.</em></h2><p>Подстраиваюсь под музыкальную концепцию, аудиторию и коммерческую задачу площадки. Можно начать с одной даты и перейти к серии.</p><a className="button button-primary" href={telegram} target="_blank" rel="noreferrer">Обсудить сотрудничество <Arrow /></a></div></section>

      <section className="video" id="video"><div className="section-head inverse" data-reveal><p className="eyebrow">Реальные выступления</p><h2>Сначала смотри.<br /><em>Потом решай.</em></h2><p>Без стоков. Только реальные клубы, публика, сцена и работа в моменте.</p></div><VideoGallery /></section>

      <section className="experience" id="experience">
        <div className="experience-copy" data-reveal><p className="eyebrow">Опыт</p><h2>Восемь лет<br /><em>внутри индустрии.</em></h2><p>Клубы, рестораны, частные события, корпоративы, открытия и продюсирование площадок.</p></div>
        <div className="venue-list">{venues.map(venue => <div key={venue.city} data-reveal><strong>{venue.city}</strong><span>{venue.names}</span></div>)}</div>
        <div className="experience-gallery"><Photo src="/media/backstage.webp" className="gallery-main" label="CHARACTER · LIGHT · MOMENT" position="center"/><Photo src="/media/club-wide.webp" className="gallery-small" label="CROWD · ENERGY" position="center"/></div>
      </section>

      <div className="marquee marquee-orange" aria-hidden="true"><div>СЦЕНА · МУЗЫКА · ХАРИЗМА · ЭНЕРГИЯ · КОНТЕНТ · СЦЕНА · МУЗЫКА · ХАРИЗМА · ЭНЕРГИЯ · КОНТЕНТ ·</div></div>

      <section className="contacts" id="contacts">
        <div className="contact-heading" data-reveal><p className="eyebrow">Бронирование</p><h2>Расскажи задачу.<br /><em>Я предложу формат.</em></h2><p>Заполни короткую форму. Сообщение откроется в Telegram - ты увидишь его перед отправкой.</p><div className="direct-contacts"><a href={telegram} target="_blank" rel="noreferrer">Telegram · @kava_studia <Arrow /></a><a href="tel:+79932542217">+7 993 254-22-17 <Arrow /></a><a href="mailto:juri.kava@yandex.ru">juri.kava@yandex.ru <Arrow /></a></div></div>
        <ContactForm />
      </section>

      <footer><a className="brand footer-brand" href="#top">KAVA<span>MC</span></a><div className="footer-center"><p>Клубный MC · ведущий · продюсер событий</p><div className="footer-legal"><Link href="/privacy">Конфиденциальность</Link><Link href="/consent">Согласие на обработку данных</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Условия использования</Link><Link href="/requisites">Контакты оператора</Link></div></div><p>© {new Date().getFullYear()} KAVA MC</p></footer>

      <nav className="mobile-bottom-nav" aria-label="Быстрые действия"><a href="#top"><Icon name="home" size={20}/>Главная</a><a href="#formats"><Icon name="grid" size={20}/>Форматы</a><a href="#video"><Icon name="media" size={20}/>Видео</a><a className="mobile-book" href={telegram} target="_blank" rel="noreferrer"><Icon name="bolt" size={20}/>Обсудить</a></nav>
    </main>
  );
}
