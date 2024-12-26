import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelTest } from './entities/level-test.entity';
import { PatternPractice } from './entities/pattern-practice.entity';
import { LevelTestController } from './controller/level-test.controller';
import { PatternPracticeController } from './controller/pattern-practice.controller';
import { LevelTestService } from './services/level-test.service';
import { PatternPracticeService } from './services/pattern-practice.service';

@Module({
  imports: [TypeOrmModule.forFeature([LevelTest, PatternPractice])],
  controllers: [LevelTestController, PatternPracticeController],
  providers: [LevelTestService, PatternPracticeService],
  exports: [LevelTestService, PatternPracticeService],
})
export class AssessmentModule {}
