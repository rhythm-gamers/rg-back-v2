import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { LevelTestProgressService } from '../services/level-test-progress.service';
import { UpsertLevelTestProgressDto } from '../dto/upsert-level-test-progress.dto';
import { Response } from 'express';
import { User } from 'src/user/entity/user.entity';
import { getUserFromRequest } from 'src/common/utils/user-request-handler';

@Controller('progress/level-test')
export class LevelTestProgressController {
  constructor(private readonly levelTestProgressService: LevelTestProgressService) {}

  @Post()
  async uploadLevelTestProgress(@Req() req, @Res() res: Response, @Body() dto: UpsertLevelTestProgressDto) {
    const user: User = getUserFromRequest(req);
    const result = await this.levelTestProgressService.upsert(dto, user);
    res.status(HttpStatus.OK).send(result);
  }
}
