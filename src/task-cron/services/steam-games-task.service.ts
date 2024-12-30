import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebasePath } from 'src/common/enum/firebase-path';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SteamService } from 'src/steam/steam.service';
import { User } from 'src/user/entity/user.entity';
import { Not, Or, Repository } from 'typeorm';

export class SteamGamesTaskService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly steamService: SteamService,
    private readonly firebaseService: FirebaseService,
  ) {
    this.handleUpdateRhythmDevilRateTask();
  }

  @Cron('0 3 * * *')
  async handleUpdateRhythmDevilRateTask() {
    const users: User[] = await this.userRepository.find({ where: { steamid: Or(Not(null), Not('')) } });

    const promises = users.map(user => {
      const steamid = user.steamid;

      return this.steamService.calcSteamGameDevilRate(steamid).then(devilRates => {
        return this.firebaseService.push(FirebasePath.STEAM_GAME_DEVIL_RATE + user.id, devilRates);
      });
    });

    await Promise.all(promises);

    // for (const user of users) {
    //   const steamid = user.steamid;
    //   const devilRates = await this.steamService.calcSteamGameDevilRate(steamid);
    //   console.log(user.id, devilRates);
    //   await this.firebaseService.push(FirebasePath.STEAM_GAME_DEVIL_RATE + user.id, devilRates);
    // }
  }
}
