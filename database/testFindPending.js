const {
  findPending,
} = require("./repositories/articleRepository");

async function test() {
  try {
    const articles = await findPending();

    console.log(`Found ${articles.length} pending articles\n`);

    console.log(articles[0]);
  } catch (err) {
    console.error(err);
  }

  process.exit();
}

test();