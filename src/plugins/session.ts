import fp from 'fastify-plugin';
import { fastifySession, type SessionStore } from '@fastify/session';
import type { FastifyInstance, FastifyPluginAsync, Session } from 'fastify';
import type { RedisClientType } from 'redis';

declare module 'fastify' {
  interface Session {
    userId: number;
    role: 'admin' | 'student' | 'not-set';
  }
}

export class RedisSessionStore implements SessionStore {
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
      callback(err);
    }
  }

  async set (sid: string, session: Session, callback: any) {
    try {
      const data = JSON.stringify(session);
      await this.client.set(this.key(sid), data, {
        expiration: {
          type: 'PX',
          value: this.ttl()
        }
      });
      callback(null);
    } catch (err) {
      callback(err);
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

export type SessionPluginOptions = {
  secret: string;
  store: SessionStore | undefined;
};

export const sessionPlugin: FastifyPluginAsync<SessionPluginOptions> = fp(
  async (app: FastifyInstance, opts: SessionPluginOptions) => {
    const MS_TO_EXPIRE = 60 * 1000;

    await app.register(fastifySession, {
      secret: opts.secret,
      cookieName: 'sid',
      saveUninitialized: false,
      store: opts.store,
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
