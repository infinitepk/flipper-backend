const { GoogleDecoder } = require("google-news-url-decoder");

const decoder = new GoogleDecoder();

async function resolveGoogleUrl(googleUrl) {
  try {
    const result = await decoder.decode(googleUrl);

    if (result.status) {
      return result.decoded_url;
    }

    console.error(result.message);
    return null;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

module.exports = {
  resolveGoogleUrl,
};