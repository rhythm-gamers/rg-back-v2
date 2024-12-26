import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

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

  async mget(keys: string[]): Promise<string[]> {
    const clientResult = await this.redisClient.mget(keys);
    const result = keys.reduce((prev, key, idx) => {
      prev[key] = clientResult[idx];
      return result;
    }, {});
    return result;
  }

  async set(key: string, value: string | number, ttl?: number) {
    const result = ttl ? await this.redisClient.set(key, value, 'EX', ttl) : await this.redisClient.set(key, value);
    return result;
  }

  async del(keys: string[]) {
    return await this.redisClient.del(keys);
  }

  discard() {
    this.redisClient.discard();
  }

  multi() {
    return this.redisClient.multi();
  }
}
