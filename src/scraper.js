const axios = require('axios');
const cheerio = require('cheerio');

class DotaScraper {
  constructor() {
    this.baseURL = 'https://www.dota2.com';
  }

  async scrapeNews() {
    try {
      const response = await axios.get(`${this.baseURL}/news`);
      const $ = cheerio.load(response.data);
      const news = [];

      $('.news-item').each((i, element) => {
        const title = $(element).find('.title').text().trim();
        const link = this.baseURL + $(element).find('a').attr('href');
        const date = $(element).find('.date').text().trim();

        if (title && link) {
          news.push({ title, link, date });
        }
      });

      return news.length > 0 ? news[0] : null;
    } catch (error) {
      console.error('Ошибка парсинга новостей:', error);
      return null;
    }
  }

  async scrapeLatestPatch() {
    try {
      const response = await axios.get(`${this.baseURL}/patches`);
      const $ = cheerio.load(response.data);
      let latestPatch = null;

      $('.patch-item a').each((i, element) => {
        const href = $(element).attr('href');
        if (href && href.includes('/patches/')) {
          latestPatch = {
            link: this.baseURL + href,
            version: href.split('/').pop()
          };
          return false;
        }
      });

      return latestPatch;
    } catch (error) {
      console.error('Ошибка парсинга патчей:', error);
      return null;
    }
  }
}

module.exports = new DotaScraper();
