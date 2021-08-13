const fetch = require("node-fetch");
const CronJob = require("cron").CronJob;

const path = process.env.slack_path;

const job = new CronJob(
  "00 00 08 * * *",
  () =>
    [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ].forEach((sign) => getHoroscope(sign)),
  null,
  true
);

getHoroscope("libra");

async function getHoroscope(sign) {
  const res = await fetch(
    `https://aztro.sameerkumar.website?sign=${sign}&day=today`,
    { method: "POST" }
  );
  const json = await res.json();

  slack(`${sign}: ${json.description}`);
}

function slack(message) {
  return fetch(`https://hooks.slack.com/services/${path}`, {
    method: "post",
    body: JSON.stringify({
      text: message,
    }),
  });
}
