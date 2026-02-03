import { Bot, InlineKeyboard } from 'grammy';

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL;

if (!token) {
  throw new Error('Missing TELEGRAM_BOT_TOKEN');
}
if (!webAppUrl) {
  throw new Error('Missing WEBAPP_URL');
}

const bot = new Bot(token);

bot.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard().webApp('Открыть маркет', webAppUrl);
  await ctx.reply('Добро пожаловать! Откройте маркет подарков.', { reply_markup: keyboard });
});

bot.command('topup', async (ctx) => {
  const amount = 50;
  await ctx.reply(`Используйте оплату Stars в вебаппе. Текущий пакет: ${amount} ⭐.`);
});

bot.catch((err) => {
  console.error('Bot error', err);
});

bot.start();
