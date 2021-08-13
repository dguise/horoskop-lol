const fetch = require("node-fetch");
const CronJob = require("cron").CronJob;

const path = process.env.slack_path;
const scopes = [
  { en: "Aries", sv: "Väduren" },
  { en: "Taurus", sv: "Oxen" },
  { en: "Gemini", sv: "Tvillingarna" },
  { en: "Cancer", sv: "Kräftan" },
  { en: "Leo", sv: "Lejonet" },
  { en: "Virgo", sv: "Jungfrun" },
  { en: "Libra", sv: "Vågen" },
  { en: "Scorpio", sv: "Skorpionen" },
  { en: "Sagittarius", sv: "Skytten" },
  { en: "Capricorn", sv: "Stenbocken" },
  { en: "Aquarius", sv: "Vattumannen" },
  { en: "Pisces", sv: "Fisken" },
];

const job = new CronJob(
  "00 00 08 * * *",
  () => scopes.forEach((sign) => getHoroscope(sign)),
  null,
  true
);

getHoroscope(scopes[Math.floor(Math.random() * scopes.length)]);

async function getHoroscope(sign) {
  const res = await fetch(
    `https://aztro.sameerkumar.website?sign=${sign.en}&day=today`,
    { method: "POST" }
  );

  const json = await res.json();
  slack(
    `:${sign.en.toLowerCase()}: ${sign.sv} (${json.date_range}): 
    ${json.description} 
      \r\n Turnummer: ${json.lucky_number} 
      \r\n Turtid: ${json.lucky_time} 
      \r\n Bästis: ${scopes.find((x) => x.en == json.compatibility).sv}`
  );
}

function slack(message) {
  return fetch(`https://hooks.slack.com/services/${path}`, {
    method: "post",
    body: JSON.stringify({
      text: message,
    }),
  });
}
