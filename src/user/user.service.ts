import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { RedisRepository } from 'src/common/utils/redis.repository';
import { CommonType } from 'src/common/enum/common.type';
import { InjectRepository } from '@nestjs/typeorm';
import { nullifyEntity } from 'src/common/utils/nullify-entity';
import { UserDetailDto } from './dto/user-detail.dto';
import { UserRole } from 'src/common/enum/user-role.enum';
import { BackupUser } from './entity/backup-user.entity';
import { S3BucketService } from 'src/common/utils/s3-bucket.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { getDecoratorFields } from 'src/common/utils/get-decorator-field';
import { RedisPrefix } from 'src/common/enum/redis-prefix.enum';
import { RedisTTL } from 'src/common/enum/redis-ttl.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisRepository: RedisRepository,
    private readonly s3BucketService: S3BucketService,
  ) {}

  async save(user: User) {
    await this.userRepository.save(user);
    await this.redisRepository.set(`${RedisPrefix.DUP_NAME}:${user.username}`, CommonType.TRUE, RedisTTL.TTL_DAY);
    await this.redisRepository.set(`${RedisPrefix.DUP_NICK}:${user.nickname}`, CommonType.TRUE, RedisTTL.TTL_DAY);
  }

  async withdraw(uuid: string) {
    const redisTransaction = this.redisRepository.multi();

    const decoratorFields: string[] = getDecoratorFields(User, ['one-to-one', 'one-to-many']);
    const user: User = await this.userRepository.findOne({
      where: {
        id: uuid,
      },
      relations: decoratorFields,
    });

    const { username, nickname } = user;

    try {
      await this.userRepository.manager.transaction(async manager => {
        for (const field of decoratorFields) {
          const relation = user[field];
          delete user[field];

          if (field === 'comments' || !relation) continue;
          if (Array.isArray(relation) && relation.length === 0) continue;

          if (Array.isArray(relation)) {
            for (const item of relation) {
              console.log(item);
              manager.remove(item);
            }
          } else {
            manager.remove(relation);
          }
        }

        const backup = new BackupUser(user);
        nullifyEntity(user, this.userRepository.metadata, ['id']);
        backup.deletedAt = user.deletedAt = new Date();
        user.role = UserRole.WITHDRAWED;

        await manager.save(User, user);
        await manager.save(BackupUser, backup);

        redisTransaction.set(`${RedisPrefix.DUP_NAME}:${username}`, CommonType.FALSE, 'EX', RedisTTL.TTL_DAY);
        redisTransaction.set(`${RedisPrefix.DUP_NICK}:${nickname}`, CommonType.FALSE, 'EX', RedisTTL.TTL_DAY);

        const redisResult = await new Promise((resolve, reject) => {
          redisTransaction.exec((err, replies) => {
            if (err) reject(err);
            resolve(replies);
          });
        });
        if (!redisResult) throw new Error('redis transaction failed');
      });
    } catch (err) {
      console.error(err);
      redisTransaction.discard();
      throw err;
    }
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username: username });
  }

  async findByNickname(nickname: string): Promise<User> {
    return await this.userRepository.findOneBy({ nickname: nickname });
  }

  async findById(uuid: string): Promise<User> {
    return await this.userRepository.findOneBy({ id: uuid });
  }

  async details(key: string): Promise<UserDetailDto> {
    const user: User = await this.findByUsername(key);
    return new UserDetailDto(user);
  }

  async updateNickname(uuid: string, nickname: string): Promise<void> {
    if (this.checkDuplicatedNickname(nickname)) {
      throw new Error('중복된 닉네임');
    }
    const user: User = await this.userRepository.findOneBy({ id: uuid });
    const prevNick: string = user.nickname;
    user.nickname = nickname;

    await this.toggleNicknameUsage(prevNick, nickname);
    await this.userRepository.save(user);
  }

  async updateProfile(user: User, data: UpdateProfileDto): Promise<void> {
    await this.checkDuplicatedNickname(data.nickname);
    const prevNick: string = user.nickname;
    await this.toggleNicknameUsage(prevNick, data.nickname);

    await this.userRepository.manager.transaction(async manager => {
      await manager.update(User, { id: user.id }, data);
    });
  }

  async renewal(uuid: string, password: string): Promise<void> {
    await this.userRepository.update({ id: uuid }, { password: password });
  }

  async checkDuplicatedUsername(username: string): Promise<void> {
    const redisVal: string = await this.redisRepository.get(`${RedisPrefix.DUP_NAME}:${username}`);
    if (redisVal) {
      if (Number(redisVal) === CommonType.TRUE) throw new ConflictException('중복된 회원명입니다');
    } else {
      const user: User = await this.userRepository.findOneBy({ username: username });
      if (user) throw new ConflictException('중복된 회원명입니다');
      await this.redisRepository.set(`${RedisPrefix.DUP_NAME}:${username}`, CommonType.FALSE, RedisTTL.TTL_DAY);
    }
  }

  async checkDuplicatedNickname(nickname: string): Promise<void> {
    if (!nickname) return;
    const redisVal = await this.redisRepository.get(`${RedisPrefix.DUP_NICK}:${nickname}`);
    if (redisVal) {
      if (Number(redisVal) === CommonType.TRUE) throw new ConflictException('중복된 닉네임입니다');
    } else {
      const user: User = await this.userRepository.findOneBy({ nickname: nickname });
      if (user) throw new ConflictException('중복된 닉네임입니다');
      await this.redisRepository.set(`${RedisPrefix.DUP_NICK}:${nickname}`, CommonType.FALSE, RedisTTL.TTL_DAY);
    }
  }

  async generatePresignedUrl(uuid: string): Promise<string> {
    const presignedUrl: string = await this.s3BucketService.createPresignedUrl(this.generateProfileImagePath(uuid));
    await this.redisRepository.set(`${RedisPrefix.PRESIGNED_IMAGE_URL}:${uuid}`, presignedUrl);
    return presignedUrl;
  }

  async uploadProfileImage(uuid: string): Promise<void> {
    const val = await this.redisRepository.get(`${RedisPrefix.PRESIGNED_IMAGE_URL}:${uuid}`);
    if (!val) throw new BadRequestException('presigned url을 먼저 발급해주세요');
    await this.userRepository.update({ id: uuid }, { profileImage: this.generateProfileImagePath(uuid) });
    await this.redisRepository.del([`${RedisPrefix.PRESIGNED_IMAGE_URL}:${uuid}`]);
  }

  private generateProfileImagePath(uuid: string): string {
    return `user/profile/image/${uuid}`;
  }

  private async toggleNicknameUsage(prevNick: string, nickname: string): Promise<void> {
    if (!nickname) return;
    await this.redisRepository.set(`${RedisPrefix.DUP_NICK}:${prevNick}`, CommonType.FALSE, RedisTTL.TTL_DAY);
    await this.redisRepository.set(`${RedisPrefix.DUP_NICK}:${nickname}`, CommonType.TRUE, RedisTTL.TTL_DAY);
  }
}
