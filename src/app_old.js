const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Configurar o token do bot fornecido pelo BotFather
const { TOKEN } = process.env;

// Criar uma instância do bot
const bot = new TelegramBot(TOKEN, { polling: true });
// dardo
// 1 fora
// 2 errou
// 3 errou
// 4 errou
// 5 errou
// 6 acertou

// bola
// 1 fora
// 2 trave
// 3 gol
// 4 gol
// 5 gol

// caça-niquel
// 64 777
// 43 limão
// 22 uva
// 1 barra

// basket
// 1 errou
// 2 errou
// 3 errou
// 4 acertou
// 5 acertou

const handleResult = ({ emoji, value }) => {
  const messages = [
    'Mande um nude ou uma foto sexy.',
    'Jogue de novo!',
    'Escolha alguem para te fazer a pergunta que ela quiser, não vale mentir.',
    'Faça uma pergunta para alguem.',
    'Jogue de novo!',
    'Escolha alguem para mandar um nude ou uma foto sexy.',
    'Para fora, jogue de novo!',
    '',
  ];
  const valuesSlotWins = [1, 22, 43, 64];
  const valuesFBallWins = [3, 4, 5];
  const valuesBBallLosing = [1, 2, 3];
  let msgResult = '';
  messages.forEach((msg, i) => {
    const indexMsg = i + 1;
    if (emoji === '🎲') {
      if (indexMsg === value) {
        console.log('dado');
        msgResult = msg;
      }
    }
    if (emoji === '🎯' || emoji === '🎳') {
      console.log(value);
      if (value === 6) {
        msgResult = messages[0];
      } else if (value === 1) {
        msgResult = messages[6];
      } else {
        msgResult = messages[1];
      }
    }
    if (emoji === '🎰') {
      if (valuesSlotWins.includes(value)) {
        msgResult = 'Você ganhou!';
      } else {
        msgResult = 'Você perdeu, tente outra vez!';
      }
    }
    if (emoji === '⚽') {
      if (valuesFBallWins.includes(value)) {
        msgResult = 'Golaço! Escolha alguem para mandar um nudes.';
      } else if (value === 2) {
        msgResult = 'Faça uma declaração pra um @. Seja de carinho, amizade ou amor.';
      } else {
        msgResult = "Foraaa! Mande um nude!"
      }
    }
    if (emoji === '🏀') {
      if (!valuesBBallLosing.includes(value)) {
        msgResult = 'Na cesta! peça um nude de comemoração.';
      } else {
        msgResult = 'Mais sorte na proxima!';
      }
    }
    console.log('msgResult: ', msgResult);
  });
  return msgResult;
};

// Responder a comandos '/start' ou '/play'
bot.onText(/\/(start|play)/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    'Bem-vindo ao Jogo de Dados! Clique em /roll para jogar.'
  );
});

// Responder ao comando '/roll'
bot.onText(/\/roll/, async (msg) => {
  const chatId = msg.chat.id;

  // Enviar o emoji de dado animado
  const { dice } = await bot.sendDice(chatId);
  console.log(dice, 'msg', msg);

  setTimeout(
    () =>
      bot.sendMessage(chatId, `@${msg.from.username}, ${handleResult(dice)}`),
    2500
  );
});

// Capturar o resultado do dado enviado pelo bot

bot.on('dice', (msg) => {
  const chatId = msg.chat.id;
  const dice = msg.dice;
  console.log('fora: ', msg);
  // Montar a mensagem de resultado com o número gerado
  setTimeout(
    () =>
      bot.sendMessage(chatId, `@${msg.from.username}, ${handleResult(dice)}`),
    2500
  );
});

// Iniciar o bot
bot.on('polling_error', (error) => {
  console.log(error);
});
