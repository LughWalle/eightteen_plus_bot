const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const TOKEN = '6323370361:AAFlBT8HyUoc1RzQwsytPYe45lAhYSOjT_E';

const bot = new TelegramBot(TOKEN, { polling: true });

let isObservingEmojis = {};
let groupId;
const handleResult = ({ emoji, value }) => {
    let msgResult = '';
    if (emoji === '🎲') {
        if (value === 1) {
            msgResult = 'Mande um nude ou uma foto sexy.';
        } else if (value === 2) {
            msgResult = 'Jogue de novo!';
        } else if (value === 3) {
            msgResult = 'Escolha alguém para te fazer uma pergunta que ela quiser, não vale mentir.';
        } else if (value === 4) {
            msgResult = 'Faça uma pergunta para alguém.';
        } else if (value === 5) {
            msgResult = 'Jogue de novo!';
        } else if (value === 6) {
            msgResult = 'Escolha alguém para mandar um nude ou uma foto sexy.';
        }
    } else if (emoji === '🎯' || emoji === '🎳') {
        if (value === 1) {
            msgResult = 'Para fora, jogue de novo!';
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
            msgResult = 'Golaço! Escolha alguém para mandar um nude.';
        } else if (value === 2) {
            msgResult = 'Faça uma declaração pra um @. Seja de carinho, amizade ou amor.';
        } else {
            msgResult = "Foraaa! Mande um nude!";
        }
    } else if (emoji === '🏀') {
        const valuesBBallLosing = [1, 2, 3];
        if (!valuesBBallLosing.includes(value)) {
            msgResult = 'Na cesta! Peça um nude de comemoração.';
        } else {
            msgResult = 'Mais sorte na próxima!';
        }
    }
    return msgResult;
};

const emojiCommands = {
    '🎲': {
        name: 'dado',
        description: 'Jogue um dado animado.',
    },
    '🎯': {
        name: 'tiro',
        description: 'Jogue um tiro e veja o resultado.',
    },
    '🎳': {
        name: 'boliche',
        description: 'Jogue um pino de boliche e veja o resultado.',
    },
    '🎰': {
        name: 'slot_machine',
        description: 'Jogue na máquina de slots e veja o resultado.',
    },
    '⚽': {
        name: 'futebol',
        description: 'Jogue um pênalti e veja o resultado.',
    },
    '🏀': {
        name: 'basquete',
        description: 'Jogue uma bola de basquete e veja o resultado.',
    },
};

bot.onText(/\/(playgame|init)/, (msg) => {
    groupId = msg.chat.id;
    isObservingEmojis[groupId] = true;
    bot.sendMessage(groupId, 'Jogo iniciado! Escolha um desses emojis e divirta-se: 🎲, 🎯, 🏀, ⚽, 🎳, ou 🎰.');
});
bot.onText(/\/stopgame/, (msg) => {
    groupId = msg.chat.id;
    delete isObservingEmojis[groupId];
    bot.sendMessage(groupId, 'Agora observando emojis!');
});

bot.on('message', (msg) => {
    const groupId = msg.chat.id;
    if (isObservingEmojis[groupId]) {
        const dice = msg.dice;
        if (dice) {
            setTimeout(
                () =>
                    bot.sendMessage(groupId, `@${msg.from.username}, ${handleResult(dice)}`),
                2500
            );
        }
    }
});
