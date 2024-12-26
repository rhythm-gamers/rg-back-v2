import { Injectable } from '@nestjs/common';
import { RedisRepository } from './common/utils/redis.repository';

@Injectable()
export class AppService {
  constructor(private readonly redisRepository: RedisRepository) {}
  async getHello(): Promise<any> {}
}
