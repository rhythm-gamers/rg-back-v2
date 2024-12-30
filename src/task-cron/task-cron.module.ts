import { Module } from '@nestjs/common';
import { SteamGamesTaskService } from './services/steam-games-task.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { SteamModule } from 'src/steam/steam.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FirebaseModule, SteamModule],
  providers: [SteamGamesTaskService],
})
export class TaskCronModule {}
