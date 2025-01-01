import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { SkipAuth } from 'src/common/metadata/skip-auth.metadata';
import { User } from 'src/user/entity/user.entity';
import { RenewPasswordDto } from './dto/renew-password.dto';
import { TokenType } from 'src/common/enum/token-type.enum';
import { RenewTokenGuard } from './guards/renew-token.guard';
import { CommonType } from 'src/common/enum/common.type';
import { getUserFromRequest } from 'src/common/utils/user-request-handler';
import { SteamService } from 'src/steam/steam.service';
import { EmailVerificationDto } from './dto/email-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly steamService: SteamService,
  ) {}

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
  @Post('email/send-code')
  async sendCode(@Res() res: Response, @Body() emailDto: EmailVerificationDto) {
    await this.authService.generateVerificationCode(emailDto.email);
    res.status(HttpStatus.OK).send();
  }

  @SkipAuth()
  @Post('email/verify-code')
  async verifyCode(@Res() res: Response, @Body() emailDto: EmailVerificationDto) {
    await this.authService.checkVerificationCode(emailDto.email, emailDto.code);
    res.status(HttpStatus.OK).send();
  }

  @SkipAuth()
  @Post('/signin')
  async signin(@Res() res, @Body() body: SigninDto) {
    try {
      const [accessToken, refreshToken] = await this.authService.signin(body);

      this.authService.addCookie(res, TokenType.ACCESS_TOKEN, accessToken, CommonType.TTL_HOUR);
      res.status(HttpStatus.OK).send({ refreshToken: refreshToken });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).send(err.message);
    }
  }

  @Post('/signout')
  async signout(@Req() req, @Res() res) {
    const user: User = getUserFromRequest(req);
    await this.authService.signout(user);

    this.authService.removeCookie(res, TokenType.ACCESS_TOKEN);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put('/renew-password')
  async renewPassword(@Req() req, @Res() res: Response, @Body() dto: RenewPasswordDto) {
    const user: User = getUserFromRequest(req);
    await this.authService.renewPassword(user.id, dto.password);

    this.authService.removeCookie(res, TokenType.ACCESS_TOKEN);
    res.send();
  }

  @SkipAuth()
  @UseGuards(RenewTokenGuard)
  @Post('/renew-token')
  async renewToken(@Req() req, @Res() res: Response) {
    const user: User = getUserFromRequest(req);
    const [accessToken, refreshToken] = await this.authService.renewToken(user);

    this.authService.addCookie(res, TokenType.ACCESS_TOKEN, accessToken, CommonType.TTL_HOUR);
    res.send(refreshToken);
  }

  @Delete('/withdraw')
  async withdraw(@Req() req, @Res() res) {
    const user: User = getUserFromRequest(req);
    await this.authService.withdraw(user.id);

    this.authService.removeCookie(res, TokenType.ACCESS_TOKEN);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @SkipAuth()
  @Get('steam')
  async getSteamRedirectUrl(@Res() res: Response) {
    const redirectUrl = await this.steamService.getRedirectUrl();
    res.redirect(redirectUrl);
  }

  @SkipAuth()
  @Get('steam/authenticate')
  async steamAuthenticate(@Req() req, @Res() res: Response) {
    try {
      const user = await this.steamService.authenticate(req);
      await this.authService.setSteamUidToRedis(user.steamid);
      res.redirect('https://www.naver.com');
    } catch (err) {
      console.log(err);
    }
  }
}
