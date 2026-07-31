const axios = require("axios");

const LISTING_URL =
  "https://plus.timesofindia.com/toi-feed/toi-shorts/toia/listing/home?lang=1&fv=117";

function getImageUrl(imageId) {
  return `https://static.toiimg.com/thumb.cms?photoid=${imageId}&width=1080&height=1920&resizemode=1`;
}

async function fetchStory(id) {
  const url =
    `https://plus.timesofindia.com/toi-feed/toi-shorts/toia/vs/show?id=${id}&source=toi&dm=t&fv=117`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
    timeout: 10000,
  });

  return data;
}

module.exports = {

  name: "TOI Shorts",

  categories: [
  "shorts",
],

  async getStories() {

    const { data } = await axios.get(LISTING_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    const stories = [];

    for (const card of data.items || []) {

      if (card.cardType !== "singleItem") continue;

      const item = card.itemA;

      if (item.template !== "visualstory") continue;

      const story = item.visualstory;

      stories.push({

        id: story.id,

        title: story.headLine,

        synopsis: story.synopsis,

        coverImage: story.imageid,

        publishedAt: story.updatedDate,

      });

    }

    return stories;
  },

  async getStory(id) {

    const data = await fetchStory(id);

    const pages = [];

    for (const page of data.items || []) {

      pages.push({

        page: page.pos,

        title: page.hl,

        caption: page.cap ?? "",

        image: getImageUrl(page.imageid),

      });

    }

    return pages;
  }

};