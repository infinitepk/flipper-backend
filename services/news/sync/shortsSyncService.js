const shortsService = require("../../shorts/shortsService");

const {
  createShort,
  deletePagesByStoryId,
  createShortPage,
} = require("../../../database/repositories/shortsRepository");

async function runShortsSync() {

  console.log("======================================");
  console.log("Running TOI Shorts Sync...");
  console.log("======================================");

  const stories = await shortsService.getStories();

  console.log(`Found ${stories.length} stories`);

  for (const story of stories) {

    console.log(`Syncing: ${story.title}`);

    await createShort({
      story_id: story.id,
      title: story.title,
      synopsis: story.synopsis,
      cover_image: story.coverImage,
      source: "TOI Shorts",
      published_at: new Date(Number(story.publishedAt)),
    });

    const pages = await shortsService.getStory(story.id);

    await deletePagesByStoryId(story.id);

    for (const page of pages) {

      await createShortPage({
        story_id: story.id,
        page_number: page.page,
        title: page.title,
        caption: page.caption,
        image_url: page.image,
      });

    }

    console.log(`✓ ${pages.length} pages saved`);

  }

  console.log("======================================");
  console.log("TOI Shorts Sync Completed");
  console.log("======================================");

}

module.exports = {
  runShortsSync,
};