import { Module } from '@nestjs/common';
import { SteamService } from './steam.service';

@Module({
  exports: [SteamService],
  providers: [SteamService],
})
export class SteamModule {}
