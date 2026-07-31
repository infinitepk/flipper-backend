const shorts = require("./services/news/providers/shorts");
(async () => {

    const stories = await shorts.getStories();

    console.log("Stories:", stories.length);

    console.log(stories[0]);

    const pages = await shorts.getStory(stories[0].id);

    console.log("Pages:", pages.length);

    console.log(pages[0]);

})();