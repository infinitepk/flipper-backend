const axios = require("axios");

async function test(cp) {
  const url =
    `https://plus.timesofindia.com/toi-feed/toi-shorts/toia/listing/home?lang=1&fv=117&cp=${cp}`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
    },
  });

  const stories = [];

  for (const item of data.items) {
    if (item.itemA?.template === "visualstory") {
      stories.push(item.itemA.visualstory);
    }
  }

  console.log("Visual Stories:", stories.length);
  const ids = stories.map(s => s.id);

console.log("Visual Stories:", stories.length);
console.log("Unique IDs:", new Set(ids).size);

  console.log("CP:", cp);
  console.log("PG:", data.pg);
  console.log("Stories:", data.items?.length);
}

test(1)
  .then(() => test(2))
  .then(() => test(3))
  .catch(console.error);