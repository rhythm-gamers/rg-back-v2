import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PatternPracticeProgressService } from '../services/pattern-practice-progress.service';
import { Response } from 'express';
import { UpsertPatternPracticeProgressDto } from '../dto/upsert-pattern-practice-progress.dto';
import { User } from 'src/user/entity/user.entity';
import { getUserFromRequest } from 'src/common/utils/user-request-handler';

@Controller('progress/pattern-practice')
export class PatternPracticeProgressController {
  constructor(private readonly patternPracticeProgressService: PatternPracticeProgressService) {}

  @Post()
  async upsertPatternPracticeProgress(@Req() req, @Res() res: Response, @Body() dto: UpsertPatternPracticeProgressDto) {
    const user: User = getUserFromRequest(req);
    const result = await this.patternPracticeProgressService.upsert(dto, user);
    res.send(result);
  }
}
