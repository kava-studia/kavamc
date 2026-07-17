import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { MobileMenu } from "@/components/mobile-menu";
import { VideoGallery } from "@/components/video-gallery";
import { formats, venues } from "@/data/site";

const telegram = "https://t.me/kava_studia";

function Arrow() { return <span aria-hidden="true">↗</span>; }

function Photo({ src, className = "", label, position }: { src: string; className?: string; label: string; position?: string }) {
  return (
    <div className={`photo ${className}`} style={{ backgroundImage: `linear-gradient(180deg, transparent 36%, rgba(0,0,0,.76)), url(${src})`, backgroundPosition: position }}>
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="KAVA MC - на главную">KAVA<span>MC</span></a>
        <nav aria-label="Основная навигация"><a href="#formats">Форматы</a><a href="#video">Видео</a><a href="#experience">Опыт</a><a href="#contacts">Контакты</a></nav>
        <a className="header-cta" href={telegram} target="_blank" rel="noreferrer">Обсудить дату <Arrow /></a>
        <MobileMenu />
      </header>

      <section className="hero" id="top">
        <div className="hero-noise" />
        <Photo src="/media/hero.webp" className="hero-photo" label="KAVA MC · CLUB PERFORMANCE" position="72% center" />
        <div className="hero-content" data-reveal>
          <p className="eyebrow">MC · HOST · EVENT PRODUCER</p>
          <h1>Энергия<br /><em>вечера.</em></h1>
          <p className="hero-copy">Клубный MC, ведущий и продюсер событий. Живая работа с залом, точная связка с DJ и атмосфера без кринжа и принуждения.</p>
          <div className="hero-actions"><a className="button button-primary" href="#video">Смотреть showreel</a><a className="button button-ghost" href={telegram} target="_blank" rel="noreferrer">Пригласить KAVA MC <Arrow /></a></div>
        </div>
        <div className="hero-stats" data-reveal><div><strong>8+</strong><span>лет в индустрии</span></div><div><strong>15K</strong><span>MC - сет</span></div><div><strong>30K</strong><span>MC + live guitar</span></div></div>
        <div className="scroll-mark">SCROLL · FEEL · BOOK</div>
      </section>

      <div className="ticker" aria-hidden="true"><div>KAVA MC · CLUB SET · LIVE GUITAR · EVENT PRODUCTION · KAVA MC · CLUB SET · LIVE GUITAR · EVENT PRODUCTION ·</div></div>

      <section className="manifesto section-dark">
        <p className="section-index" data-reveal>01 · POSITION</p>
        <div className="manifesto-grid">
          <h2 data-reveal>Не тамада.<br />Не аниматор.<br /><span>Не фон.</span></h2>
          <div data-reveal><p className="large-copy">KAVA MC создаёт динамику вечера, усиливает DJ - сет и держит внимание зала без дешёвых конкурсов.</p><p>Для заведения это сильная пятница или суббота, живой контакт с гостями, узнаваемые моменты для контента и цельный сценарий ночи.</p></div>
        </div>
      </section>

      <section className="formats section-light" id="formats">
        <div className="section-heading" data-reveal><div><p className="section-index">02 · FORMATS</p><h2>Выберите<br /><em>уровень энергии</em></h2></div><p>Разовый выход, серия клубных дат или полноценное событие под ключ. Каждый формат адаптируется под площадку и аудиторию.</p></div>
        <div className="format-grid">
          {formats.map((format) => (
            <article className={`format-card ${"featured" in format && format.featured ? "featured" : ""}`} key={format.title} data-reveal>
              <p className="card-index">{format.eyebrow}</p><h3>{format.title}</h3><p className="format-price">{format.price}</p><p className="format-text">{format.text}</p>
              <div className="tags">{format.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href="#contacts">Обсудить формат <Arrow /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="club section-dark">
        <Photo src="/media/club-wide.webp" className="club-photo" label="CROWD CONTROL · LIVE CONTACT" position="center" />
        <div className="club-copy">
          <p className="section-index" data-reveal>03 · FOR VENUES</p><h2 data-reveal>Когда DJ играет,<br /><em>зал должен жить.</em></h2>
          <p data-reveal>KAVA MC подключается разово или серией выступлений. Формат адаптируется под музыкальную программу, стиль заведения и задачи конкретной ночи.</p>
          <div className="benefit-list" data-reveal>{["Взаимодействие с DJ", "Импровизация и работа с залом", "Интеграции артистов и партнёров", "Контентные моменты", "Регулярные слоты и резидентство", "Live - шоу с гитарой"].map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div>
        </div>
      </section>

      <section className="video section-black" id="video">
        <div className="section-heading inverse" data-reveal><div><p className="section-index">04 · SHOWREEL</p><h2>Не верь тексту.<br /><em>Смотри.</em></h2></div><p>Реальные видео из клубов. Нажмите на карточку - ролик откроется крупно со звуком и управлением.</p></div>
        <VideoGallery />
      </section>

      <section className="live section-accent">
        <div className="live-copy">
          <p className="section-index" data-reveal>05 · SIGNATURE SHOW</p><h2 data-reveal>KAVA MC<br /><span>+</span> LIVE GUITAR</h2>
          <p data-reveal>Электронная основа, живой гитарист и MC. Rock, metal, drum and bass и rave соединяются в одном клубном шоу.</p>
          <div className="live-price" data-reveal><strong>30 000 ₽</strong><span>+ трансфер</span></div><a className="button button-dark" href={telegram} target="_blank" rel="noreferrer">Запросить live - формат <Arrow /></a>
        </div>
        <Photo src="/media/live-guitar.webp" className="live-photo" label="ROCK · DNB · RAVE" position="center" />
      </section>

      <section className="experience section-light" id="experience">
        <div className="experience-intro" data-reveal><p className="section-index">06 · EXPERIENCE</p><h2>Более восьми лет<br /><em>внутри индустрии.</em></h2><p>Клубные вечера, рестораны, городские праздники, свадьбы, корпоративы, открытия и частные события.</p></div>
        <div className="venue-list" data-reveal>{venues.map((venue) => <div key={venue.city}><strong>{venue.city}</strong><span>{venue.names}</span></div>)}</div>
        <div className="experience-gallery">
          <Photo src="/media/backstage.webp" className="gallery-main" label="LIGHT · MOMENT · CHARACTER" position="center" />
          <Photo src="/media/official.webp" className="gallery-small" label="KAVA · OFF STAGE" position="center" />
        </div>
      </section>

      <section className="photo-story section-black">
        <div className="story-copy" data-reveal><p className="section-index">07 · HUMAN CONTACT</p><h2>Микрофон - не стена.<br /><em>Это мост.</em></h2><p>Главная работа происходит не «на сцене», а между музыкой, гостями и моментом. Без давления. С чувством меры. С характером.</p></div>
        <Photo src="/media/private-event.webp" className="story-photo" label="REAL PEOPLE · REAL REACTION" position="center" />
      </section>

      <section className="process section-dark">
        <p className="section-index" data-reveal>08 · PROCESS</p>
        <div className="process-grid">{["Запрос и дата", "Формат и задачи", "Музыка и программа", "Подготовка", "Проведение", "Регулярное сотрудничество"].map((step, index) => <div className="process-step" key={step} data-reveal><span>0{index + 1}</span><h3>{step}</h3></div>)}</div>
      </section>

      <section className="pricing section-black">
        <p className="section-index" data-reveal>09 · PRICING</p>
        <div className="price-row" data-reveal><span>MC - сет</span><strong>15 000 ₽</strong><small>+ трансфер</small></div>
        <div className="price-row" data-reveal><span>MC + живой гитарист</span><strong>30 000 ₽</strong><small>+ трансфер</small></div>
        <div className="price-row" data-reveal><span>Серия выступлений</span><strong>Индивидуально</strong><small>по графику и задаче</small></div>
        <p className="pricing-note">Для постоянных слотов на несколько недель условия согласовываются индивидуально.</p>
      </section>

      <section className="contacts section-light" id="contacts">
        <div className="contact-heading" data-reveal><p className="section-index">10 · BOOKING</p><h2>Есть дата?<br /><em>Соберём вечер.</em></h2><p className="contact-note">Форма не отправляет данные на сервер сайта. Она собирает готовое сообщение и открывает Telegram - вы сами подтверждаете отправку.</p>
          <div className="direct-contacts"><a href={telegram} target="_blank" rel="noreferrer">Telegram · @kava_studia <Arrow /></a><a href="mailto:juri.kava@yandex.ru">juri.kava@yandex.ru <Arrow /></a><a href="tel:+79932542217">+7 993 254 - 22 - 17 <Arrow /></a></div>
        </div>
        <ContactForm />
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">KAVA<span>MC</span></a>
        <div className="footer-center"><p>MC · ведущий · продюсер событий</p><div className="footer-legal"><Link href="/privacy">Конфиденциальность</Link><Link href="/consent">Согласие на обработку данных</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Условия использования</Link><Link href="/requisites">Контакты оператора</Link></div></div>
        <p>© {new Date().getFullYear()} KAVA MC</p>
      </footer>
    </main>
  );
}
