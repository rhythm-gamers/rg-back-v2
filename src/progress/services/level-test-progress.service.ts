import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelTestProgress } from '../entities/level-test-progress.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { LevelTestService } from 'src/assessment/services/level-test.service';
import { UpsertLevelTestProgressDto } from '../dto/upsert-level-test-progress.dto';

@Injectable()
export class LevelTestProgressService {
  constructor(
    @InjectRepository(LevelTestProgress)
    private readonly levelTestProgressRepository: Repository<LevelTestProgress>,
    private readonly levelTestService: LevelTestService,
  ) {}

  async upsert(dto: UpsertLevelTestProgressDto, user: User) {
    const levelTestId: number = dto.levelTestId;
    delete dto.levelTestId;

    const levelTestProgress: LevelTestProgress =
      (await this.levelTestProgressRepository.findOne({
        where: {
          levelTest: { id: levelTestId },
          user: user,
        },
        relations: ['user', 'levelTest'],
      })) ?? new LevelTestProgress();

    Object.assign(levelTestProgress, {
      ...dto,
      user: user,
      levelTest: levelTestProgress.levelTest ?? (await this.levelTestService.findOne(levelTestId)),
    });

    return await this.levelTestProgressRepository.save(levelTestProgress);
  }
}
