import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Реферальная программа",
  description: "Реферальная программа KAVA MC: познакомьте меня с клиентом на свадьбу, корпоратив, организацию мероприятия или live show и заранее зафиксируйте вознаграждение.",
  alternates: { canonical: "/referral" },
};

const referralMessage = encodeURIComponent("Привет! Хочу участвовать в реферальной программе KAVA MC. Есть потенциальный клиент / контакт, хочу заранее согласовать условия.");

export default function ReferralPage() {
  return (
    <main className="bento-subpage">
      <div className="bento-subpage-shell">
        <header className="bento-header">
          <Link className="bento-logo" href="/">KAVA <span>MC</span></Link>
          <nav className="bento-nav"><Link href="/eminem-tribute">Eminem Show</Link><Link href="/poleznoe">Полезное</Link><Link href="/#contacts">Контакты</Link></nav>
          <a className="bento-header-cta" href={`https://t.me/kava_studia?text=${referralMessage}`} target="_blank" rel="noreferrer">Привести клиента ↗</a>
        </header>

        <section className="bento-subpage-head">
          <Link className="bento-back" href="/">← На главную</Link>
          <span className="bento-kicker">Реферальная программа</span>
          <h1>Хорошее знакомство должно быть выгодно всем.</h1>
          <p>Если ты знаешь пару, компанию, площадку или организатора, которым нужен ведущий, организация события, Club Show или Eminem Live Tribute Show - познакомь нас. Условия вознаграждения фиксируем заранее, до передачи контакта.</p>
        </section>

        <section className="bento-referral-steps">
          <article><strong>01</strong><h2>Пишешь мне</h2><p>Коротко говоришь, кто потенциальный клиент и какая примерно задача. Не нужно передавать чужие персональные данные без согласия человека.</p></article>
          <article><strong>02</strong><h2>Фиксируем условия</h2><p>До знакомства договариваемся о формате и размере вознаграждения. Условия зависят от типа проекта и моей части в нём.</p></article>
          <article><strong>03</strong><h2>Получаешь вознаграждение</h2><p>После заключения договора, проведения проекта и фактической оплаты клиентом выполняем заранее зафиксированную договорённость.</p></article>
        </section>

        <div className="bento-article">
          <article className="bento-article-main">
            <section>
              <h2>Что можно рекомендовать</h2>
              <ul>
                <li>Ведение свадьбы или корпоратива</li>
                <li>Организацию мероприятия под ключ</li>
                <li>Club Show и гостевые MC-выходы</li>
                <li>Eminem Live Tribute Show</li>
                <li>Частные мероприятия, выпускные, открытия и презентации</li>
              </ul>
            </section>
            <section>
              <h2>Что считается рекомендацией</h2>
              <p>Реферальная договорённость фиксируется до первого прямого контакта клиента со мной. Если клиент уже находится со мной в переговорах, заявка не считается новой рекомендацией.</p>
            </section>
            <section>
              <h2>Без спама и серых схем</h2>
              <p>Не нужно рассылать мои контакты случайным людям, выдавать себя за моего представителя или обещать цену от моего имени. Лучше одно нормальное знакомство, чем сто сообщений «вам нужен ведущий?».</p>
            </section>
          </article>
          <aside className="bento-article-side">
            <span className="bento-kicker">Есть контакт?</span>
            <h3>Сначала согласуем условия.</h3>
            <p>Напиши мне до знакомства с клиентом. Зафиксируем договорённость в переписке и только после этого делаем интро.</p>
            <a href={`https://t.me/kava_studia?text=${referralMessage}`} target="_blank" rel="noreferrer">Написать в Telegram ↗</a>
          </aside>
        </div>
      </div>
    </main>
  );
}
