const axios = require('axios');
const cheerio = require('cheerio');

async function test() {

    const url =
    'https://timesofindia.indiatimes.com/business/international-business/iran-us-peace-deal-signed-62-million-barrels-set-to-leave-hormuz-as-asia-braces-for-oil-glut/articleshow/131819722.cms';

    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    console.log(
        $('meta[name="description"]').attr('content')
    );

    console.log(
        $('meta[property="og:description"]').attr('content')
    );
}

test();