import fp from 'fastify-plugin';
import { fastifySession, type SessionStore } from '@fastify/session';
import type { RedisClientType } from 'redis';
import type { Session } from 'fastify';

declare module 'fastify' {
  interface Session {
    userId: number;
  }
}

class RedisStore implements SessionStore {
  constructor (
    private client: RedisClientType,
    private opts: {
      prefix: string;
      ttl: number
    }
  ) {}

  private key (sid: string) {
    return this.opts.prefix + sid;
  }

  private ttl () {
    return this.opts.ttl;
  }

  async get (sid: string, callback: any) {
    try {
      const data = await this.client.get(this.key(sid));
      if (!data) return callback(null);
      const session = JSON.parse(data);
      callback(null, session);
    } catch (err) {
      callback(err as Error);
    }
  }

  async set (sid: string, session: Session, callback: any) {
    try {
      const data = JSON.stringify(session);
      await this.client.set(this.key(sid), data, { expiration: { type: 'PX', value: this.ttl() } });
      callback(null);
    } catch (err: any) {
      callback(err as Error);
    }
  }

  async destroy (sid: string, callback: any) {
    try {
      await this.client.del(this.key(sid));
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}

export const sessionPlugin = fp(async (app) => {
  // If you're behind nginx/ALB with HTTPS:
  // app.setTrustProxy(true);

  const MS_TO_EXPIRE = 60 * 1000;

  const store = new RedisStore(app.redis, {
    prefix: 'sess:',
    ttl: MS_TO_EXPIRE,
  });

  await app.register(fastifySession, {
    secret:
      process.env['SESSION_SECRET'] ??
      'change-me-change-me-change-me-change-me',
    cookieName: 'sid',
    saveUninitialized: false,
    store,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: 'auto',
      sameSite: 'lax',
      path: '/',
      maxAge: MS_TO_EXPIRE,
    },
  });
});
