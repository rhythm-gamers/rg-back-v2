import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { ChainableCommander } from 'ioredis';

@Injectable()
export class RedisRepository {
  private readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
    });
  }

  async get(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  async mget(keys: string[]): Promise<Record<string, string>> {
    const clientResult = await this.redisClient.mget(keys);
    return this.generateKeyValuePair(keys, clientResult);
  }

  async getdel(key: string): Promise<string> {
    return await this.redisClient.getdel(key);
  }

  async mgetdel(keys: string[]): Promise<Record<string, string>> {
    const clientResult = await this.redisClient.mget(keys);
    this.redisClient.del(keys);
    return this.generateKeyValuePair(keys, clientResult);
  }

  private generateKeyValuePair(keys: string[], values: string[]) {
    return keys.reduce((prev, key, idx) => {
      prev[key] = values[idx];
      return prev;
    }, {});
  }

  async set(key: string, value: string | number, ttl?: number): Promise<'OK'> {
    return ttl ? await this.redisClient.set(key, value, 'EX', ttl) : await this.redisClient.set(key, value);
  }

  async del(keys: string[]): Promise<number> {
    return await this.redisClient.del(keys);
  }

  discard(): void {
    this.redisClient.discard();
  }

  multi(): ChainableCommander {
    return this.redisClient.multi();
  }
}
