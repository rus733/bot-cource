const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '5033480262:AAHuffFqZ1hwDfTYRGLQuB4uj6qGe0hVAXo';

const bot = new TelegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9 , а ты должен ее угадать!');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Играть -угадай цифру ' },
  ]);
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp');
      return bot.sendMessage(chatId, `Привет ${msg.from.first_name}!!!`);
    }
    if (text === '/info') {
      //await bot.sendMessage(chatId, `ты написал мне ${text}`);
      return bot.sendMessage(chatId, `тебя зовут  ${msg.from.first_name} ${msg.from.username}`);
    }
    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, `${msg.from.first_name}, я тебя не понял , попробуй еще раз! `);
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(chatId, `Поздравляю , ты угадал цифру ${chats[chatId]}!!! `, againOptions);
    } else {
      return await bot.sendMessage(chatId, `Ты  не угадал цифру , бот загадал цифру ${chats[chatId]} `, againOptions);
    }

    //console.log(msg);
  });
};
start();
