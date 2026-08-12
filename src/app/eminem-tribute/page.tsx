import type { Metadata } from "next";
import Link from "next/link";
import { links } from "@/data/links";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Eminem Live Tribute Show",
  description:
    "Eminem Live Tribute Show by KAVA MC - live rap tribute формат для клубов, фестивалей, корпоративов и специальных событий. Москва и Московская область.",
  alternates: { canonical: "/eminem-tribute" },
  openGraph: {
    title: "Eminem Live Tribute Show by KAVA MC",
    description: "Живое рэп-шоу KAVA MC для клубов, фестивалей, корпоративов и специальных событий.",
    images: [{ url: "/media/club-wide.webp", width: 1200, height: 630, alt: "KAVA MC live performance" }],
  },
};

const formats = [
  { time: "15", title: "Спецвыход", text: "Короткий ударный блок для корпоратива, открытия или специального выхода." },
  { time: "30", title: "Клубный сет", text: "Концентрированный формат для клубной ночи, бара или тематического события." },
  { time: "45", title: "Полный трибьют-сет", text: "Полноценная программа с драматургией, переходами и работой с публикой." },
  { time: "60", title: "Расширенное шоу", text: "Большая концертная версия для отдельного события или большой сцены." },
];

const structure = [
  "Интро и быстрый вход в узнаваемый материал",
  "Хитовый блок с плотной рэп-подачей и работой с залом",
  "Контрастный эмоциональный фрагмент внутри общей драматургии",
  "Живые переходы и взаимодействие с публикой",
  "Финальный блок с максимальной энергией и сильной точкой шоу",
];

export default function EminemTributePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>KAVA <span>MC</span></Link>
        <nav>
          <a href="#show">Шоу</a>
          <a href="#formats">Форматы</a>
          <a href="#booking">Букинг</a>
          <Link href="/">Все направления KAVA</Link>
        </nav>
        <a className={styles.headerCta} href={links.telegram} target="_blank" rel="noreferrer">Пригласить шоу</a>
      </header>

      <section className={styles.hero} id="show">
        <div className={styles.heroImage} aria-hidden="true" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>KAVA MC · ТРИБЬЮТ-ШОУ</p>
          <h1>EMINEM<br /><em>LIVE TRIBUTE</em><br />SHOW</h1>
          <p className={styles.lead}>Живой рэп-трибьют с фокусом на технику, подачу, энергию и контакт с залом. Самостоятельный сценический продукт KAVA MC.</p>
          <div className={styles.actions}>
            <a href={links.telegram} target="_blank" rel="noreferrer" className={styles.primary}>Пригласить шоу</a>
            <a href="#booking" className={styles.secondary}>Информация для букинга</a>
          </div>
          <p className={styles.status}>Клубы · фестивали · корпоративы · специальные события · Москва и другие города по договорённости.</p>
        </div>
      </section>

      <section className={styles.statement}>
        <p>НЕ КАРАОКЕ. НЕ ПАРОДИЯ.</p>
        <h2>Трибьют через живую подачу MC KAVA.</h2>
        <div className={styles.statementGrid}>
          <p>Основа формата — исполнение материала Eminem вживую, сценическая работа, собственная подача и концертная динамика.</p>
          <p>Программа адаптируется по длине и технической конфигурации под клуб, фестиваль, корпоратив или отдельное тематическое событие.</p>
        </div>
      </section>

      <section className={styles.liveProof}>
        <div>
          <p className={styles.kicker}>ЖИВОЙ МАТЕРИАЛ KAVA MC</p>
          <h2>Сцена. Рэп. Контакт с залом.</h2>
          <p>Здесь — реальный фрагмент, где KAVA MC читает Eminem вживую, и отдельный момент работы с публикой.</p>
        </div>
        <div className={styles.videoGrid}>
          <video controls playsInline preload="metadata" poster="/media/club-wide.webp">
            <source src="/media/eminem-live.mp4" type="video/mp4" />
          </video>
          <video controls playsInline preload="metadata" poster="/media/poster-crowd.webp">
            <source src="/media/crowd-energy.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section className={styles.formats} id="formats">
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>ФОРМАТЫ ШОУ</p>
          <h2>Один продукт.<br />Несколько сценических длин.</h2>
        </div>
        <div className={styles.formatGrid}>
          {formats.map((item) => (
            <article key={item.time}>
              <strong>{item.time}<small> МИН</small></strong>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.launch}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>СТРУКТУРА ШОУ</p>
          <h2>Как устроена программа.</h2>
        </div>
        <div className={styles.launchList}>
          {structure.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}
        </div>
      </section>

      <section className={styles.booking} id="booking">
        <div>
          <p className={styles.kicker}>БУКИНГ · КЛУБЫ · СОБЫТИЯ</p>
          <h2>Есть сцена?<br />Давайте сделаем сильный live.</h2>
          <p>Для букинга достаточно города, даты, формата события, площадки и базовой информации о технических возможностях сцены. Остальное собираем в рабочий райдер.</p>
        </div>
        <div className={styles.bookingCard}>
          <span>EMINEM LIVE TRIBUTE SHOW</span>
          <h3>KAVA MC</h3>
          <p>Клубы, фестивали, корпоративы, тематические события и специальные гостевые выходы.</p>
          <a href={links.telegram} target="_blank" rel="noreferrer">Telegram →</a>
          <a href={links.vk} target="_blank" rel="noreferrer">ВКонтакте →</a>
          <a href={links.max} target="_blank" rel="noreferrer">MAX →</a>
          <a href={`tel:${links.phone}`}>{links.phoneLabel} →</a>
          <a href={`mailto:${links.email}`}>{links.email} →</a>
        </div>
      </section>

      <section className={styles.legal}>
        <h2>Важно о формате</h2>
        <p>Eminem Live Tribute Show by KAVA MC является независимым tribute-проектом и не является официальным шоу Eminem, не аффилирован с Eminem, его командой или правообладателями.</p>
        <p>Вопросы лицензирования публичного исполнения репертуара и распределения обязанностей между артистом, площадкой и организатором фиксируются до мероприятия в договоре. Использование официальной айдентики и материалов правообладателей как собственной айдентики проекта не предполагается.</p>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.brand}>KAVA <span>MC</span></Link>
        <p>Организация · Ведение · Шоу</p>
        <p>© {new Date().getFullYear()} KAVA MC</p>
      </footer>
    </main>
  );
}
