require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const DotaScraper = require('./scraper');
const DataStorage = require('./storage');
const cron = require('node-cron');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL, 10) || 300000;

async function checkForUpdates() {
  console.log('Проверка обновлений...');

  try {
    const [latestNews, latestPatch] = await Promise.all([
      DotaScraper.scrapeNews(),
      DotaScraper.scrapeLatestPatch()
    ]);

    if (DataStorage.hasNewNews(latestNews)) {
      await sendNewsNotification(latestNews);
      DataStorage.updateNews(latestNews);
    }

    if (DataStorage.hasNewPatch(latestPatch)) {
      await sendPatchNotification(latestPatch);
      DataStorage.updatePatch(latestPatch);
    }
  } catch (error) {
    console.error('Ошибка при проверке обновлений:', error);
  }
}

async function sendNewsNotification(news) {
  const message = `📰 Новая новость на Dota 2!\n\n${news.title}\n\n🔗 ${news.link}`;
  await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  console.log('Отправлено уведомление о новости:', news.title);
}

async function sendPatchNotification(patch) {
  const message = `🛠️ Новый патч Dota 2!\n\nВерсия: ${patch.version}\n\n🔗 ${patch.link}`;
  await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  console.log('Отправлено уведомление о патче:', patch.version);
}

cron.schedule(`*/5 * * * *`, checkForUpdates);

bot.onText(/\/check/, async (msg) => {
  await checkForUpdates();
  bot.sendMessage(msg.chat.id, 'Выполняется проверка...');
});

bot.getMe().then(() => {
  console.log('Бот запущен и готов к работе!');
  checkForUpdates();
});
