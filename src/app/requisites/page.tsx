import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legal } from "@/data/legal";

export const metadata: Metadata = { title: "Контакты оператора", description: "Контактная и юридическая информация проекта KAVA MC." };

export default function RequisitesPage() {
  return <LegalPage eyebrow="LEGAL 05" title="Контакты оператора" intro="Данные для обращений по сайту, персональным данным и сотрудничеству.">
    <section><h2>Оператор сайта</h2><dl><div><dt>Наименование</dt><dd>{legal.operator}</dd></div><div><dt>Статус</dt><dd>{legal.status}</dd></div><div><dt>Место деятельности</dt><dd>{legal.location}</dd></div><div><dt>Электронная почта</dt><dd><a href={`mailto:${legal.email}`}>{legal.email}</a></dd></div><div><dt>Телефон</dt><dd><a href="tel:+79932542217">{legal.phone}</a></dd></div><div><dt>Telegram</dt><dd><a href="https://t.me/kava_studia" target="_blank" rel="noreferrer">{legal.telegram}</a></dd></div></dl></section>
    <section><h2>Обращения по персональным данным</h2><p>Направляйте запросы на {legal.email} с темой «Персональные данные». Укажите имя, контакт для ответа и суть требования.</p></section>
    <section><h2>Договорные реквизиты</h2><p>Платёжные, налоговые и договорные реквизиты предоставляются заказчику при согласовании конкретного мероприятия и зависят от выбранной формы заключения договора.</p></section>
  </LegalPage>;
}
