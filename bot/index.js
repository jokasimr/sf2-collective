import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { botOakWebhook } from './bot.js';

const log = message => async (ctx, next) => {console.log(message); await next();};

const router = new Router()
  .get('/',
    log('received get index'),
    (ctx) => ctx.response.body = 'Hello world!',
  )
  .post(
    `/bot/${Deno.env.get('TELEGRAM_BOT_TOKEN')}`,
    log('received update from telegram'),
    botOakWebhook,
  );

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
addEventListener('fetch', app.fetchEventHandler());
