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
  "Проведение события как ведущий и MC - живо, без натянутых конкурсов",
  "Отдельные сценические шоу и клубные форматы, включая Eminem Live Tribute Show",
  "Сценарная логика, программа и тайминг под конкретную аудиторию",
  "Организация мероприятия - площадка, подрядчики и общий контроль",
  "Подбор DJ, звука, света, артистов и других специалистов под задачу",
  "Личное общение со мной и один ответственный за общий результат",
];

const collaboration = [
  { n: "01", title: "Выступи у меня", text: "Eminem Live Tribute Show, Club Show, специальный рэп-блок или гостевой сценический выход.", cta: "Открыть шоу" },
  { n: "02", title: "Проведи мне", text: "Свадьба, корпоратив, день рождения, выпускной или другое событие с MC KAVA.", cta: "Проверить дату" },
  { n: "03", title: "Организуй мне", text: "Собираю мероприятие целиком: концепция, площадка, команда, программа, техника и контроль.", cta: "Обсудить проект" },
];

const catalogMedia = [
  { src: "/media/club-wide.webp", position: "50% 38%" },
  { src: "/media/club-main.webp", position: "50% 35%" },
  { src: "/media/private-event.webp", position: "50% 34%" },
  { src: "/media/backstage.webp", position: "50% 28%" },
  { src: "/media/hero.webp", position: "66% 30%" },
  { src: "/media/private-event.webp", position: "48% 38%" },
];

export default function Home() {
  return (
    <main className="home-page night-architecture">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="KAVA MC - на главную">KAVA<span>MC</span></a>
        <nav aria-label="Основная навигация"><Link href="/eminem-tribute">Eminem Show</Link><a href="#formats">Форматы</a><a href="#included">Что делаю</a><a href="#video">Видео</a><a href="#contacts">Контакты</a></nav>
        <a className="header-cta glass-action" href="#contacts">Связаться <Arrow /></a>
        <MobileMenu />
      </header>

      <section className="hero ns-hero" id="top">
        <Photo src="/media/hero.webp" className="hero-photo" label="KAVA MC · ARTIST · HOST · EVENT PRODUCER" position="64% 30%" />
        <div className="ns-hero-copy" data-reveal>
          <p className="eyebrow">Организация · Ведение · Шоу</p>
          <h1>Собираю событие.<br />Веду зал.<br /><em>Делаю шоу.</em></h1>
          <p className="hero-tagline">Я - MC KAVA. Ведущий, организатор и артист. Свадьбы, корпоративы, клубные форматы и новый флагман - Eminem Live Tribute Show.</p>
          <div className="hero-actions"><Link className="button button-primary" href="/eminem-tribute">Eminem Live Tribute Show <Arrow /></Link><a className="button button-ghost" href="#contacts">Обсудить мероприятие</a></div>
        </div>
        <div className="hero-facts" data-reveal><div><strong>8+</strong><span>лет в индустрии</span></div><div><strong>3</strong><span>способа работать со мной</span></div><div><strong>1</strong><span>лицо и ответственность</span></div></div>
      </section>

      <div className="marquee" aria-hidden="true"><div>KAVA MC · EMINEM LIVE TRIBUTE SHOW · EVENT HOST · EVENT PRODUCTION · CLUB SHOW · WEDDINGS · CORPORATES · KAVA MC ·</div></div>

      <section className="catalog" id="formats">
        <div className="content-shell catalog-head" data-reveal><div><p className="eyebrow">Форматы KAVA</p><h2>Выступи у меня.<br />Проведи мне.<br /><em>Организуй мне.</em></h2></div><p>Можно заказать отдельное шоу, пригласить меня ведущим или собрать событие целиком. Eminem Tribute сейчас - главный артистический продукт.</p></div>
        <div className="content-shell catalog-grid">
          {formats.map((format, index) => {
            const media = catalogMedia[index];
            const tribute = index === 0;
            return <article className={`catalog-card ${"featured" in format && format.featured ? "featured" : ""}`} key={format.title} data-reveal>
              <div className="catalog-card-image" style={{ backgroundImage: `linear-gradient(180deg,rgba(5,7,11,.04) 20%,rgba(5,7,11,.88)),url(${media.src})`, backgroundPosition: media.position }}><span>0{index + 1}</span>{"featured" in format && format.featured ? <b>Флагман</b> : null}</div>
              <div className="catalog-card-body"><h3>{format.title}</h3><strong>{format.price}</strong><p>{format.text}</p><div className="tags">{format.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{tribute ? <Link href="/eminem-tribute">Открыть шоу <Arrow /></Link> : <a href="#contacts">Обсудить формат <Arrow /></a>}</div>
            </article>;
          })}
        </div>
      </section>

      <section className="included" id="included">
        <div className="content-shell included-layout">
          <div className="included-title" data-reveal><p className="eyebrow">Что можно поручить мне</p><h2>Не только<br /><em>микрофон.</em></h2><p>KAVA MC - это не попытка назвать одним словом всё подряд. Это один человек, которого можно купить как артиста, ведущего или организатора - в зависимости от задачи события.</p></div>
          <div className="included-list">{included.map((item, index) => <div key={item} data-reveal><span>0{index + 1}</span><strong>{item}</strong><Icon name="check" size={22}/></div>)}</div>
        </div>
      </section>

      <section className="collaboration" id="process">
        <div className="content-shell"><div className="section-head" data-reveal><div><p className="eyebrow">Три входа в KAVA MC</p><h2>Шоу.<br />Проведение.<br /><em>Организация.</em></h2></div><p>Не нужно покупать агентство, если нужен один сильный выход. И не нужно собирать десять подрядчиков самостоятельно, если нужен весь проект.</p></div>
        <div className="collaboration-grid">{collaboration.map((item, index) => <article key={item.n} data-reveal><span>{item.n}</span><h3>{item.title}</h3><p>{item.text}</p>{index === 0 ? <Link href="/eminem-tribute">{item.cta} <Arrow /></Link> : <a href="#contacts">{item.cta} <Arrow /></a>}</article>)}</div></div>
      </section>

      <section className="visual-break ns-break"><Photo src="/media/club-wide.webp" className="visual-break-photo" label="EMINEM LIVE TRIBUTE SHOW · KAVA MC" position="50% 40%"/><div className="content-shell visual-break-inner"><div className="visual-break-copy" data-reveal><p className="eyebrow">Главный запуск</p><h2>Eminem Live<br /><em>Tribute Show.</em></h2><p>Отдельный концертный продукт для клубов, фестивалей, корпоративов и специальных событий. Сейчас собираю программу и ищу площадку для первого полноценного live showcase.</p><Link className="button button-primary" href="/eminem-tribute">Смотреть концепцию шоу <Arrow /></Link></div></div></section>

      <section className="video" id="video"><div className="content-shell"><div className="section-head inverse" data-reveal><div><p className="eyebrow">Реальная работа</p><h2>Сначала смотри.<br /><em>Потом решай.</em></h2></div><p>Здесь только реальные сцены и публика. Трибьют-шоурил будет добавлен отдельно после первого showcase - старые ролики за новый продукт не выдаём.</p></div><VideoGallery /></div></section>

      <section className="experience" id="experience">
        <div className="content-shell experience-layout"><div className="experience-copy" data-reveal><p className="eyebrow">Опыт и география</p><h2>Сцена плюс<br /><em>event производство.</em></h2><p>Клубы, свадьбы, корпоративы, частные события и организация мероприятий в Сергиевом Посаде, Москве и Московской области.</p></div>
        <div className="venue-list">{venues.map(venue => <div key={venue.city} data-reveal><strong>{venue.city}</strong><span>{venue.names}</span></div>)}</div>
        <div className="experience-gallery"><Photo src="/media/backstage.webp" className="gallery-main" label="ОРГАНИЗАЦИЯ · КОМАНДА · КОНТРОЛЬ" position="50% 28%"/><Photo src="/media/club-wide.webp" className="gallery-small" label="СЦЕНА · РЭП · ЭНЕРГИЯ" position="50% 42%"/></div></div>
      </section>

      <div className="marquee marquee-orange" aria-hidden="true"><div>ВЫСТУПИ У МЕНЯ · ПРОВЕДИ МНЕ · ОРГАНИЗУЙ МНЕ · EMINEM TRIBUTE · CLUB SHOW · СВАДЬБЫ · КОРПОРАТИВЫ ·</div></div>

      <section className="contacts" id="contacts">
        <div className="content-shell contacts-layout"><div className="contact-heading" data-reveal><p className="eyebrow">Booking и мероприятия</p><h2>Расскажите задачу.<br /><em>Я предложу формат.</em></h2><p>Можно написать по шоу, проведению или полной организации. В сообщении достаточно даты, города, площадки и того, что нужно сделать.</p><div className="direct-contacts"><a href={telegram} target="_blank" rel="noreferrer">Telegram · @kava_studia <Arrow /></a><a href="tel:+79932542217">+7 993 254-22-17 <Arrow /></a><a href="mailto:juri.kava@yandex.ru">juri.kava@yandex.ru <Arrow /></a></div></div>
        <ContactForm /></div>
      </section>

      <footer><a className="brand footer-brand" href="#top">KAVA<span>MC</span></a><div className="footer-center"><p>Организация · Ведение · Шоу</p><div className="footer-legal"><Link href="/privacy">Конфиденциальность</Link><Link href="/consent">Согласие на обработку данных</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Условия использования</Link><Link href="/requisites">Контакты оператора</Link></div></div><p>© {new Date().getFullYear()} KAVA MC</p></footer>

      <nav className="mobile-bottom-nav" aria-label="Быстрые действия"><a href="#top"><Icon name="home" size={20}/>Главная</a><Link href="/eminem-tribute"><Icon name="mic" size={20}/>Eminem</Link><a href="#video"><Icon name="media" size={20}/>Видео</a><a className="mobile-book" href="#contacts"><Icon name="bolt" size={20}/>Связаться</a></nav>
    </main>
  );
}
