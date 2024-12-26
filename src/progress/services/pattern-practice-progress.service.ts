import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatternPracticeProgress } from '../entities/pattern-practice-progress.entity';
import { Repository } from 'typeorm';
import { PatternPracticeService } from 'src/assessment/services/pattern-practice.service';
import { UpsertPatternPracticeProgressDto } from '../dto/upsert-pattern-practice-progress.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class PatternPracticeProgressService {
  constructor(
    @InjectRepository(PatternPracticeProgress)
    private readonly practiceProgressRepository: Repository<PatternPracticeProgress>,
    private readonly patternPracticeService: PatternPracticeService,
  ) {}

  async upsert(dto: UpsertPatternPracticeProgressDto, user: User) {
    const patternPracticeId: number = dto.patternPracticeId;
    delete dto.patternPracticeId;

    const patternPracticeProgress: PatternPracticeProgress =
      (await this.practiceProgressRepository.findOne({
        where: {
          patternPractice: { id: patternPracticeId },
          user: user,
        },
        relations: ['user', 'levelTest'],
      })) ?? new PatternPracticeProgress();

    Object.assign(patternPracticeProgress, {
      ...dto,
      user: user,
      patternPractice:
        patternPracticeProgress.patternPractice ?? (await this.patternPracticeService.findOne(patternPracticeId)),
    });

    return await this.practiceProgressRepository.save(patternPracticeProgress);
  }
}
