import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { Telegraf, type Context } from 'telegraf';
import { message } from 'telegraf/filters';

export interface TelegramPluginOptions {
  token: string | undefined;
}

declare module 'fastify' {
  interface FastifyInstance {
    bot: Telegraf<Context>;
  }
}

export const telegramPlugin: FastifyPluginAsync<TelegramPluginOptions> = fp(
  async (server: FastifyInstance, opts: TelegramPluginOptions) => {
    const {
      token
    } = opts;

    if (!token) throw new Error('Telegram token is required');

    const bot = new Telegraf<Context>(token);
    bot.start((ctx) => ctx.reply('Hello!'));
    bot.on(message('text'), async (ctx) => {
      console.log(
        `${ctx.from.first_name} wrote ${
          'text' in ctx.message ? ctx.message.text : ''
        }`
      );

      if (ctx.message.text) {
        await ctx.reply(ctx.message.text.toUpperCase() + ctx.message.from.first_name + ctx.message.from.id);
      }
    });

    server.addHook('onReady', async () => {
      try {
        bot.launch();
        server.log.info('Telegram long-polling started');
      } catch (err) {
        server.log.error({ err }, 'Failed to launch polling');
      }
    });

    server.addHook('onClose', () => {
      bot.stop('shutdown');
    });
  });
