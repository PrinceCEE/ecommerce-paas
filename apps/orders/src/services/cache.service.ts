import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  set(key: string, value: any) {
    return this.client.set(key, JSON.stringify(value), { EX: 3600 });
  }

  async get(key: string) {
    return this.client.get(key).then((d) => JSON.parse(d));
  }
}
