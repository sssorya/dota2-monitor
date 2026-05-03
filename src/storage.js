class DataStorage {
  constructor() {
    this.lastNews = null;
    this.lastPatch = null;
  }

  updateNews(news) {
    this.lastNews = news;
  }

  updatePatch(patch) {
    this.lastPatch = patch;
  }

  hasNewNews(currentNews) {
    return currentNews && (!this.lastNews || currentNews.link !== this.lastNews.link);
  }

  hasNewPatch(currentPatch) {
    return currentPatch && (!this.lastPatch || currentPatch.link !== this.lastPatch.link);
  }
}

module.exports = new DataStorage();
