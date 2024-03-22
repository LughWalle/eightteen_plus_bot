import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// express para funcionar no netlify
const app = express();

app.set('port', process.env.PORT || 5000);

app
  .get('/', (req, res) => {
    res.send('App is  running...');
  })
  .listen(app.get('port'), () => {
    console.log(`App is listening on port ${app.get('port')}`);
  });
// fim express

// config basica
const { TOKEN } = process.env;

const bot = new TelegramBot(TOKEN, { polling: true });

const isObservingEmojis = {};
const nudeScore = {};
const emojiScoreboard = {};
const emojiShiny = '';
let groupId;

// fim config basica

// funcoes de ajuda
const handleResult = ({ dice: { emoji, value }, from: { username }, chat: { id: groupId } }) => {
  let msgResult = '';
  if (emoji === '🎲') {
    if (value === 1) {
      msgResult = 'Mande um nude ou uma foto sexy.';
    } else if (value === 2) {
      msgResult = 'Jogue de novo!';
    } else if (value === 3) {
      msgResult =
      'Escolha alguém para te fazer uma pergunta que ela quiser, não vale mentir.';
    } else if (value === 4) {
      msgResult = 'Faça uma pergunta para alguém.';
    } else if (value === 5) {
      msgResult = 'Jogue de novo!';
    } else if (value === 6) {
      addNudeScore(username, groupId);
      msgResult = 'Escolha alguém para mandar um nude ou uma foto sexy.';
    }
  } else if (emoji === '🎯' || emoji === '🎳') {
    if (value === 6) {
      addNudeScore(username, groupId);
      msgResult = 'Na mosca, peça um nude!';
    } else if (value === 1) {
      msgResult = 'você é pessimo, Mande um nude ou uma foto sexy.';
    } else {
      msgResult = 'Jogue de novo!';
    }
  } else if (emoji === '🎰') {
    const valuesSlotWins = [1, 22, 43, 64];
    if (valuesSlotWins.includes(value)) {
      msgResult = 'Você ganhou!';
    } else {
      msgResult = 'Você perdeu, tente outra vez!';
    }
  } else if (emoji === '⚽') {
    const valuesFBallWins = [3, 4, 5];
    if (valuesFBallWins.includes(value)) {
      addNudeScore(username, groupId);
      msgResult = 'Golaço! Escolha alguém para mandar um nude.';
    } else if (value === 2) {
      msgResult =
        'Faça uma declaração pra um @. Seja de carinho, amizade ou amor.';
    } else {
      msgResult = 'Foraaa! Mande um nude!';
    }
  } else if (emoji === '🏀') {
    const valuesBBallLosing = [1, 2, 3];
    if (!valuesBBallLosing.includes(value)) {
      addNudeScore(username, groupId);
      msgResult = 'Na cesta! Peça um nude de comemoração.';
    } else {
      msgResult = 'Mais sorte na próxima!';
    }
  }
  return msgResult;
};

const handleDiceEvent = async (msg) => {
  groupId = msg.chat ? msg.chat.id : msg.chat_id;
  if (isObservingEmojis[groupId]) {
    const user = msg.from;
    if (!msg.entities) {
      if (msg.dice) {
        setTimeout(
          () => bot.sendMessage(groupId, `@${user.username}, ${handleResult(msg)}`),
          2500
        );
      }
    } else {
      const dice = await bot.sendDice(groupId, { emoji: msg.emoji });
      if (dice) {
        dice.from = user;
        setTimeout(
          () => bot.sendMessage(groupId, `@${user.username}, ${handleResult(dice)}`),
          2500
        );
      }
    }
  }
};

function addNudeScore(user, groupId) {
  if (nudeScore[groupId]) {
    if (nudeScore[groupId][user]) {
      nudeScore[groupId][user]++;
    } else {
      nudeScore[groupId][user] = 1;
    }
  } else {
    nudeScore[groupId] = { [user]: 1 };
  }
}

function getNudeScoreboard(groupId) {
  const sortedScores = Object.entries(nudeScore[groupId]).sort((a, b) => b[1] - a[1]);
  let scoreboard = '';

  sortedScores.forEach(([userId, score], index) => {
    scoreboard += `${index + 1}º - @${userId}: ${score}\n`;
  });

  return scoreboard;
}

function createKeyboard(emojiCommands) {
  return Object.entries(emojiCommands).map(([emoji, command]) => [
    { text: `${command.name}`, callback_data: emoji },
  ]);
}
function sendCommandsMessage(messageText, groupId, emojiCommands) {
  const keyboard = createKeyboard(emojiCommands);
  bot.sendMessage(
    groupId,
    messageText,
    {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    }
  );
}

// comandos
const emojiCommands = {
  '🎲': {
    name: 'dado',
    description: 'Jogue um dado e veja se a sorte esta ao seu lado.',
  },
  '🎯': {
    name: 'alvo',
    description: 'Tente acertar o alvo',
  },
  '🎳': {
    name: 'boliche',
    description: 'acerte os pinos de boliche e veja o resultado.',
  },
  '🎰': {
    name: 'slot',
    description: 'Qual o nivel da sua sorte?? jogue e veja.',
  },
  '⚽': {
    name: 'futebol',
    description: 'Jogue um pênalti e tente marcar um gol.',
  },
  '🏀': {
    name: 'basquete',
    description: 'acerte a bola na cesta.',
  },
};

// ações bot
// callback de botões

bot.on('callback_query', async (query) => {
  const {
    data,
    from,
    message,
    message: { chat }
  } = query;
  groupId = chat.id;
  const msg = {
    ...message,
    from,
    entities: 'comand',
    emoji: data
  }
  if (isObservingEmojis[groupId]) {
    handleDiceEvent(msg)
    bot.deleteMessage(chat.id, query.message.message_id);
  }
});

// comando /emojis - descontinuado?
bot.onText(/\/emojis/, (msg) => {
  let message = 'Comandos de emoji disponíveis:\n\n';
  groupId = msg.chat.id;
  if (isObservingEmojis[groupId]) {
    sendCommandsMessage(message, groupId, emojiCommands)
  }
});

// observar comandos e mandar o emoji em especifico
bot.onText(/\/(.+)/, async (msg, match) => {
  const commandName = match[1];
  for (const [emoji, command] of Object.entries(emojiCommands)) {
    if (command.name === commandName) {
      msg.emoji = emoji;
      handleDiceEvent(msg);
    }
  }
});

bot.onText(/\/(playgame|init)/, (msg) => {
  groupId = msg.chat.id;
  isObservingEmojis[groupId] = true;
  const initialText = 'Jogo iniciado! Escolha um desses emojis e divirta-se: 🎲, 🎯, 🏀, ⚽, 🎳, ou 🎰.';
  sendCommandsMessage(initialText, groupId, emojiCommands)
});

bot.onText(/\/(stopgame|finish)/, (msg) => {
  groupId = msg.chat.id;
  delete isObservingEmojis[groupId];
  bot.sendMessage(groupId, 'Fim de jogo!!');
});

bot.on('dice', (msg) => {
  handleDiceEvent(msg);
});

// /nudescore command
bot.onText(/\/nudescore/, (msg) => {
  const groupId = msg.chat.id;
  if (nudeScore[groupId]) {
    const scoreboard = getNudeScoreboard(groupId);
    bot.sendMessage(groupId, `Quem conseguiu pedir mais nudes:\n\n${scoreboard}`, { parse_mode: 'Markdown' });
  } else {
    bot.sendMessage(groupId, 'Ainda não há pontuações.');
  }
});