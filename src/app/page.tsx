import { ContactForm } from "@/components/contact-form";
import { formats, media, venues } from "@/data/site";

const telegram = "https://t.me/kava_studia";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Photo({ src, className = "", label }: { src: string; className?: string; label: string }) {
  return (
    <div className={`photo ${className}`} style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(0,0,0,.78)), url(${src})` }}>
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="KAVA MC - на главную">KAVA<span>MC</span></a>
        <nav aria-label="Основная навигация">
          <a href="#formats">Форматы</a><a href="#video">Видео</a><a href="#experience">Опыт</a><a href="#contacts">Контакты</a>
        </nav>
        <a className="header-cta" href={telegram} target="_blank" rel="noreferrer">Обсудить дату <Arrow /></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-noise" />
        <Photo src="/media/hero.svg" className="hero-photo" label="KAVA MC · LIVE" />
        <div className="hero-content">
          <p className="eyebrow">MC · HOST · EVENT PRODUCER</p>
          <h1>Энергия<br /><em>вечера.</em></h1>
          <p className="hero-copy">Клубный MC, ведущий и продюсер событий для клубов, ресторанов, частных и корпоративных мероприятий.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#video">Посмотреть видео</a>
            <a className="button button-ghost" href={telegram} target="_blank" rel="noreferrer">Пригласить KAVA MC <Arrow /></a>
          </div>
        </div>
        <div className="hero-stats">
          <div><strong>8+</strong><span>лет в индустрии</span></div>
          <div><strong>15K</strong><span>MC-сет</span></div>
          <div><strong>30K</strong><span>MC + live guitar</span></div>
        </div>
        <div className="scroll-mark">SCROLL TO FEEL THE ENERGY</div>
      </section>

      <section className="manifesto section-dark">
        <p className="section-index">01 · POSITION</p>
        <div className="manifesto-grid">
          <h2>Не тамада.<br />Не аниматор.<br /><span>Не фон.</span></h2>
          <div>
            <p className="large-copy">KAVA MC создаёт динамику вечера, работает с аудиторией, усиливает DJ-сет и держит атмосферу без дешёвых конкурсов и принуждения.</p>
            <p>Для заведения это сильная пятница или суббота, живой контакт с гостями, контентные моменты и целостный формат вечера.</p>
          </div>
        </div>
      </section>

      <section className="formats section-light" id="formats">
        <div className="section-heading">
          <div><p className="section-index">02 · FORMATS</p><h2>Выберите<br /><em>уровень энергии</em></h2></div>
          <p>Разовый выход, серия клубных дат или полноценное событие под ключ.</p>
        </div>
        <div className="format-grid">
          {formats.map((format) => (
            <article className={`format-card ${"featured" in format && format.featured ? "featured" : ""}`} key={format.title}>
              <p className="card-index">{format.eyebrow}</p>
              <h3>{format.title}</h3>
              <p className="format-price">{format.price}</p>
              <p className="format-text">{format.text}</p>
              <div className="tags">{format.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <a href="#contacts" aria-label={`Обсудить ${format.title}`}>Обсудить формат <Arrow /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="club section-dark">
        <Photo src="/media/club.svg" className="club-photo" label="CLUB MODE" />
        <div className="club-copy">
          <p className="section-index">03 · FOR VENUES</p>
          <h2>Когда DJ играет,<br /><em>зал должен жить.</em></h2>
          <p>KAVA MC подключается разово или серией выступлений. Формат адаптируется под аудиторию, музыкальную программу, стиль заведения и задачи конкретного вечера.</p>
          <div className="benefit-list">
            {["Взаимодействие с DJ", "Импровизация и работа с залом", "Интеграции артистов и партнёров", "Контентные моменты", "Регулярные слоты и резидентство", "Live-шоу с гитарой"].map((item, index) => (
              <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>
            ))}
          </div>
        </div>
      </section>

      <section className="video section-black" id="video">
        <div className="section-heading inverse">
          <div><p className="section-index">04 · SHOWREEL</p><h2>Сначала<br /><em>посмотри.</em></h2></div>
          <p>Видео подключаются через один файл данных. Пока стоят готовые места под ролики и фотопостеры.</p>
        </div>
        <div className="media-grid">
          {media.map((item, index) => (
            <article className={`media-card media-${index + 1}`} key={item.id}>
              <div className="media-poster" style={{ backgroundImage: `linear-gradient(180deg, transparent 20%, rgba(0,0,0,.9)), url(${item.poster})` }}>
                <button className="play" aria-label={`Смотреть ${item.title}`}>▶</button>
                <div className="media-meta"><span>{item.type}</span><span>{item.year}</span></div>
                <h3>{item.title}</h3><p>{item.venue}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="live section-accent">
        <div className="live-copy">
          <p className="section-index">05 · SIGNATURE SHOW</p>
          <h2>KAVA MC<br /><span>+</span> LIVE GUITAR</h2>
          <p>Электронная основа, живой гитарист и MC. Rock, metal, drum and bass и rave соединяются в одном клубном шоу.</p>
          <div className="live-price"><strong>30 000 ₽</strong><span>+ трансфер</span></div>
          <a className="button button-dark" href={telegram} target="_blank" rel="noreferrer">Запросить live-формат <Arrow /></a>
        </div>
        <Photo src="/media/live.svg" className="live-photo" label="ROCK · DNB · RAVE" />
      </section>

      <section className="experience section-light" id="experience">
        <div className="experience-intro">
          <p className="section-index">06 · EXPERIENCE</p>
          <h2>Более восьми лет<br /><em>внутри индустрии.</em></h2>
          <p>Клубные вечера, рестораны, городские праздники, свадьбы, корпоративы, открытия и частные события.</p>
        </div>
        <div className="venue-list">{venues.map((venue) => <div key={venue.city}><strong>{venue.city}</strong><span>{venue.names}</span></div>)}</div>
        <div className="experience-gallery">
          <Photo src="/media/backstage.svg" className="gallery-main" label="BACKSTAGE" />
          <Photo src="/media/official.svg" className="gallery-small" label="OFFICIAL EVENT" />
        </div>
      </section>

      <section className="process section-dark">
        <p className="section-index">07 · PROCESS</p>
        <div className="process-grid">
          {["Запрос и дата", "Формат и задачи", "Музыка и программа", "Подготовка", "Проведение", "Регулярное сотрудничество"].map((step, index) => (
            <div className="process-step" key={step}><span>0{index + 1}</span><h3>{step}</h3></div>
          ))}
        </div>
      </section>

      <section className="pricing section-black">
        <p className="section-index">08 · PRICING</p>
        <div className="price-row"><span>MC-сет</span><strong>15 000 ₽</strong><small>+ трансфер</small></div>
        <div className="price-row"><span>MC + живой гитарист</span><strong>30 000 ₽</strong><small>+ трансфер</small></div>
        <div className="price-row"><span>Серия выступлений</span><strong>Индивидуально</strong><small>по графику и задаче</small></div>
        <p className="pricing-note">Для постоянных слотов на несколько недель условия согласовываются индивидуально.</p>
      </section>

      <section className="contacts section-light" id="contacts">
        <div className="contact-heading">
          <p className="section-index">09 · BOOKING</p>
          <h2>Есть дата?<br /><em>Давайте соберём вечер.</em></h2>
          <div className="direct-contacts">
            <a href={telegram} target="_blank" rel="noreferrer">Telegram · @kava_studia <Arrow /></a>
            <a href="mailto:juri.kava@yandex.ru">juri.kava@yandex.ru <Arrow /></a>
            <a href="tel:+79932542217">+7 993 254-22-17 <Arrow /></a>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">KAVA<span>MC</span></a>
        <p>MC · ведущий · продюсер событий</p>
        <p>© {new Date().getFullYear()} KAVA MC</p>
      </footer>
    </main>
  );
}
