import { Body, Controller, Delete, HttpStatus, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { SkipAuth } from 'src/common/metadata/skip-auth.metadata';
import { User } from 'src/user/entity/user.entity';
import { RenewPasswordDto } from './dto/renew-password.dto';
import { TokenType } from 'src/common/enum/token-type.enum';
import { RenewTokenGuard } from './guards/renew-token.guard';
import { CommonType } from 'src/common/constants/common.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @SkipAuth()
  @Post('/signup')
  async signup(@Req() req, @Res() res: Response, @Body() body: SignupDto) {
    try {
      await this.authService.signup(body);
      res.status(HttpStatus.OK).send();
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).send(err.message);
    }
  }

  @SkipAuth()
  @Post('/signin')
  async signin(@Req() req, @Res() res, @Body() body: SigninDto) {
    try {
      const token: string[] = await this.authService.signin(body);

      this.authService.addCookie(res, TokenType.ACCESS_TOKEN, token[0], CommonType.TTL_HOUR);
      res.status(HttpStatus.OK).send({ refreshToken: token[1] });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).send(err.message);
    }
  }

  @Post('/signout')
  async signout(@Req() req, @Res() res) {
    const user: User = req.user;
    await this.authService.signout(user);

    this.authService.removeCookie(res, TokenType.ACCESS_TOKEN);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put('/renew-password')
  async renewPassword(@Req() req, @Res() res: Response, @Body() dto: RenewPasswordDto) {
    const user: User = this.getUserFromRequest(req);
    await this.authService.renewPassword(user.id, dto.password);

    this.authService.removeCookie(res, TokenType.ACCESS_TOKEN);
    res.send();
  }

  @SkipAuth()
  @UseGuards(RenewTokenGuard)
  @Post('/renew-token')
  async renewToken(@Req() req, @Res() res: Response) {
    const user: User = this.getUserFromRequest(req);
    const accessToken: string = await this.authService.renewToken(user);

    this.authService.addCookie(res, TokenType.ACCESS_TOKEN, accessToken, CommonType.TTL_HOUR);
    res.send();
  }

  @Delete('/withdraw')
  async withdraw(@Req() req, @Res() res) {
    const user: User = req.user;
    await this.authService.withdraw(user.id);

    this.authService.removeCookie(res, TokenType.ACCESS_TOKEN);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  private getUserFromRequest(req) {
    return req.user;
  }
}
