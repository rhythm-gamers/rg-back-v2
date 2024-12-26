import { Injectable } from '@nestjs/common';
import { RedisRepository } from './common/utils/redis.repository';

@Injectable()
export class AppService {
  constructor(private readonly redisRepository: RedisRepository) {}
  async getHello(): Promise<any> {
    console.log(await this.redisRepository.get('test'));
    await this.redisRepository.set('test1', '10');
    return await this.redisRepository.mget(['test', 'test1', 'test2']);
  }
}
