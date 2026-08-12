import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legal } from "@/data/legal";
import { links } from "@/data/links";

export const metadata: Metadata = { title: "Контакты оператора", description: "Контактная и юридическая информация проекта KAVA MC." };

export default function RequisitesPage() {
  return <LegalPage eyebrow="LEGAL 05" title="Контакты оператора" intro="Данные для обращений по сайту, персональным данным и сотрудничеству.">
    <section><h2>Оператор сайта</h2><dl><div><dt>Наименование</dt><dd>{legal.operator}</dd></div><div><dt>Статус</dt><dd>{legal.status}</dd></div><div><dt>Место деятельности</dt><dd>{legal.location}</dd></div><div><dt>Электронная почта</dt><dd><a href={`mailto:${legal.email}`}>{legal.email}</a></dd></div><div><dt>Телефон</dt><dd><a href={`tel:${links.phone}`}>{legal.phone}</a></dd></div><div><dt>Telegram</dt><dd><a href={links.telegram} target="_blank" rel="noreferrer">{legal.telegram}</a></dd></div><div><dt>ВКонтакте</dt><dd><a href={links.vk} target="_blank" rel="noreferrer">kava_studia</a></dd></div><div><dt>MAX</dt><dd><a href={links.max} target="_blank" rel="noreferrer">Профиль KAVA MC</a></dd></div></dl></section>
    <section><h2>Обращения по персональным данным</h2><p>Направляйте запросы на {legal.email} с темой «Персональные данные». Укажите имя, контакт для ответа и суть требования.</p></section>
    <section><h2>Договорные реквизиты</h2><p>Платёжные, налоговые и договорные реквизиты предоставляются заказчику при согласовании конкретного мероприятия и зависят от выбранной формы заключения договора.</p></section>
  </LegalPage>;
}
