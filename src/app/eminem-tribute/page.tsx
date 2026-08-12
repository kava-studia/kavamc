import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

const telegram = "https://t.me/kava_studia";

export const metadata: Metadata = {
  title: "Eminem Live Tribute Show",
  description:
    "Eminem Live Tribute Show by KAVA MC - новый live rap tribute формат для клубов, фестивалей, корпоративов и специальных событий. Москва и Московская область.",
  alternates: { canonical: "/eminem-tribute" },
  openGraph: {
    title: "Eminem Live Tribute Show by KAVA MC",
    description: "Живое рэп-шоу. Новый концертный формат KAVA MC для клубов и специальных событий.",
    images: [{ url: "/media/club-wide.webp", width: 1200, height: 630, alt: "KAVA MC live performance" }],
  },
};

const formats = [
  { time: "15", title: "Special guest", text: "Короткий ударный блок для корпоратива, открытия или специального выхода." },
  { time: "30", title: "Club showcase", text: "Основной стартовый формат для клубной ночи, бара или тематического события." },
  { time: "45", title: "Full tribute set", text: "Расширенная программа с драматургией, переходами и работой с публикой." },
  { time: "60", title: "Extended show", text: "Большая версия программы после обкатки полного концертного материала." },
];

const launch = [
  "Собираем финальный сет-лист и драматургию шоу",
  "Готовим минуса, переходы, интро и технический райдер",
  "Ищем площадку для первого полноценного live showcase",
  "Снимаем многокамерный материал и чистый звук",
  "Из showcase собираем главный showreel и пакет для букинга",
];

export default function EminemTributePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>KAVA <span>MC</span></Link>
        <nav>
          <a href="#show">Шоу</a>
          <a href="#formats">Форматы</a>
          <a href="#booking">Booking</a>
          <Link href="/">Все направления KAVA</Link>
        </nav>
        <a className={styles.headerCta} href={telegram} target="_blank" rel="noreferrer">Предложить площадку</a>
      </header>

      <section className={styles.hero} id="show">
        <div className={styles.heroImage} aria-hidden="true" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>KAVA MC PRESENTS</p>
          <h1>EMINEM<br /><em>LIVE TRIBUTE</em><br />SHOW</h1>
          <p className={styles.lead}>Живой рэп-трибьют с фокусом на подачу, технику, энергию и контакт с залом. Новый самостоятельный концертный продукт KAVA MC.</p>
          <div className={styles.actions}>
            <a href={telegram} target="_blank" rel="noreferrer" className={styles.primary}>Пригласить на showcase</a>
            <a href="#booking" className={styles.secondary}>Получить booking info</a>
          </div>
          <p className={styles.status}>Первый полноценный live showcase сейчас готовится. Для клубов открыт диалог по тестовой дате и совместному запуску.</p>
        </div>
      </section>

      <section className={styles.statement}>
        <p>НЕ КАРАОКЕ. НЕ ПАРОДИЯ.</p>
        <h2>Трибьют через живую подачу MC KAVA.</h2>
        <div className={styles.statementGrid}>
          <p>Основа формата - исполнение материала Eminem вживую, сценическая работа, собственная подача и концертная динамика.</p>
          <p>Шоу проектируется как самостоятельный номер для клубов, фестивалей, корпоративов и специальных событий.</p>
        </div>
      </section>

      <section className={styles.liveProof}>
        <div>
          <p className={styles.kicker}>CURRENT LIVE MATERIAL</p>
          <h2>Сцену и зал уже умеем.<br />Теперь собираем tribute.</h2>
          <p>Ниже - существующие live-фрагменты KAVA MC. Это не запись Eminem Tribute Show: отдельный showreel появится после первого showcase. Мы не выдаём старые выступления за новый продукт.</p>
        </div>
        <div className={styles.videoGrid}>
          <video controls playsInline preload="metadata" poster="/media/poster-club.webp">
            <source src="/media/club-live.mp4" type="video/mp4" />
          </video>
          <video controls playsInline preload="metadata" poster="/media/poster-crowd.webp">
            <source src="/media/crowd-energy.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section className={styles.formats} id="formats">
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>SHOW FORMATS</p>
          <h2>Один продукт.<br />Несколько сценических длин.</h2>
        </div>
        <div className={styles.formatGrid}>
          {formats.map((item) => (
            <article key={item.time}>
              <strong>{item.time}<small> MIN</small></strong>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.launch}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>LAUNCH MODE</p>
          <h2>Что собираем прямо сейчас.</h2>
        </div>
        <div className={styles.launchList}>
          {launch.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}
        </div>
      </section>

      <section className={styles.booking} id="booking">
        <div>
          <p className={styles.kicker}>BOOKING / CLUBS / EVENTS</p>
          <h2>Есть сцена?<br />Давайте сделаем первый сильный live.</h2>
          <p>Сейчас приоритет - клубы и площадки Москвы и Московской области, которые готовы обсудить showcase, тематическую ночь или гостевой live-блок.</p>
        </div>
        <div className={styles.bookingCard}>
          <span>EMINEM LIVE TRIBUTE SHOW</span>
          <h3>KAVA MC</h3>
          <p>Для запроса даты пришлите город, площадку, предполагаемую дату, формат события и технические возможности сцены.</p>
          <a href={telegram} target="_blank" rel="noreferrer">Написать по booking →</a>
          <a href="tel:+79932542217">+7 993 254-22-17 →</a>
          <a href="mailto:juri.kava@yandex.ru">juri.kava@yandex.ru →</a>
        </div>
      </section>

      <section className={styles.legal}>
        <h2>Важно о формате</h2>
        <p>Eminem Live Tribute Show by KAVA MC является независимым tribute-проектом и не является официальным шоу Eminem, не аффилирован с Eminem, его командой или правообладателями.</p>
        <p>Вопросы лицензирования публичного исполнения репертуара и распределения обязанностей между артистом, площадкой и организатором фиксируются до мероприятия в договоре. Использование оригинальных товарных знаков, официальной айдентики и материалов правообладателей как собственной айдентики проекта не предполагается.</p>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.brand}>KAVA <span>MC</span></Link>
        <p>Организация · Ведение · Шоу</p>
        <p>© {new Date().getFullYear()} KAVA MC</p>
      </footer>
    </main>
  );
}
