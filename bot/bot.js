import { Bot, webhookCallback } from 'https://raw.githubusercontent.com/grammyjs/grammY/main/deno/src/mod.ts';

export const bot = new Bot(Deno.env.get('TELEGRAM_BOT_TOKEN'));


// React to /start command
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
bot.on('message', (ctx) => ctx.reply('Got another message!'));
bot.on('edited_message',
    (ctx) => ctx.reply("^ Caught you in the act!", {
        reply_to_message_id: ctx.msg.message_id,
    })
);


export const botOakWebhook = webhookCallback(bot, 'oak');

if (import.meta.main)
    bot.start();


