const host = "kavamc.vercel.app";
const key = "7c1f0a9d8e3b4f62a5c7d91e0b4a6f83";
const base = `https://${host}`;

const defaultPaths = [
  "/",
  "/eminem-tribute",
  "/uslugi/vedushchiy-na-svadbu",
  "/uslugi/vedushchiy-na-korporativ",
  "/uslugi/organizatsiya-meropriyatiy",
  "/uslugi/club-mc",
  "/poleznoe",
  "/poleznoe/chek-list-podgotovki-meropriyatiya",
  "/poleznoe/kak-vybrat-vedushego-na-svadbu",
  "/poleznoe/chek-list-podgotovki-svadby",
  "/poleznoe/kak-vybrat-ploshadku-dlya-meropriyatiya",
  "/poleznoe/kak-sobrat-korporativ",
  "/referral",
  "/legal",
];

const args = process.argv.slice(2);
const paths = args.length ? args : defaultPaths;
const urlList = [...new Set(paths.map((value) => value.startsWith("http") ? value : `${base}${value.startsWith("/") ? value : `/${value}`}`))];

for (const url of urlList) {
  if (!url.startsWith(base)) {
    throw new Error(`Отказ: IndexNow скрипт отправляет только production URL ${base}. Получено: ${url}`);
  }
}

const response = await fetch("https://yandex.com/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${base}/${key}.txt`,
    urlList,
  }),
});

console.log(`IndexNow: HTTP ${response.status}`);
console.log(`Отправлено URL: ${urlList.length}`);
if (!response.ok && response.status !== 202) {
  const body = await response.text();
  console.error(body);
  process.exitCode = 1;
}
