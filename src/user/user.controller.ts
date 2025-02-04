import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { SkipAuth } from 'src/common/metadata/skip-auth.metadata';
import { User } from './entity/user.entity';
import { UserDetailDto } from './dto/user-detail.dto';
import { Response } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { getUserFromRequest } from 'src/common/utils/user-request-handler';
import { UpdateSteamIdDto } from './dto/update-steam-id.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async profile(@Req() req, @Res() res) {
    const user: User = getUserFromRequest(req);
    const detailDto: UserDetailDto = new UserDetailDto(user);
    res.send(detailDto);
  }

  @Get('steam-games')
  async getMySteamGames(@Req() req, @Res() res: Response) {
    const user: User = getUserFromRequest(req);
    const result = await this.userService.getMySteamGamesStatus(user);
    res.send(result);
  }

  @SkipAuth()
  @Get('/:username')
  async otherProfile(@Req() req, @Res() res, @Param('username') username: string) {
    const detailDto: UserDetailDto = await this.userService.details(username);

    res.send(detailDto);
  }

  @Patch()
  async updateProfile(@Req() req, @Res() res: Response, @Body() data: UpdateProfileDto) {
    const user: User = getUserFromRequest(req);
    await this.userService.updateProfile(user, data);

    res.status(HttpStatus.OK).send();
  }

  @Get('profile-image/url')
  async generateProfileImageUploadUrl(@Req() req, @Res() res: Response) {
    const user: User = getUserFromRequest(req);
    const presignedUrl = this.userService.generatePresignedUrl(user.id);
    res.status(HttpStatus.OK).send({ url: presignedUrl });
  }

  @Post('profile-image')
  async uploadProfileImage(@Req() req, @Res() res: Response) {
    const user: User = getUserFromRequest(req);
    await this.userService.uploadProfileImage(user.id);
    res.status(HttpStatus.OK).send();
  }

  @Post('steam-id')
  async updateSteamId(@Req() req, @Res() res: Response, @Body() body: UpdateSteamIdDto) {
    const user: User = getUserFromRequest(req);
    await this.userService.updateSteamId(user, body);
    res.send();
  }
}
