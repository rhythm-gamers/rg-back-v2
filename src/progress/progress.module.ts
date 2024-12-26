import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelTestProgress } from './entities/level-test-progress.entity';
import { PatternPracticeProgress } from './entities/pattern-practice-progress.entity';
import { LevelTestProgressService } from './services/level-test-progress.service';
import { PatternPracticeProgressService } from './services/pattern-practice-progress.service';
import { LevelTestProgressController } from './controllers/level-test-progress.controller';
import { PatternPracticeProgressController } from './controllers/pattern-practice-progress.controller';
import { AssessmentModule } from 'src/assessment/assessment.module';

@Module({
  imports: [TypeOrmModule.forFeature([LevelTestProgress, PatternPracticeProgress]), AssessmentModule],
  controllers: [LevelTestProgressController, PatternPracticeProgressController],
  providers: [LevelTestProgressService, PatternPracticeProgressService],
})
export class ProgressModule {}
