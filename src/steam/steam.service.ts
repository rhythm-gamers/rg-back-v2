import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SteamAuth = require('node-steam-openid');
import axios from 'axios';
import qs = require('qs');
import { SteamGamePartial } from './type/steam-game.type';
import { SteamGameAchievement } from './type/steam-game-achievement.type';
import { SteamGameRating } from './type/steam-game-rating.type';

const axiosInstance = axios.create({
  paramsSerializer: params => qs.stringify(params),
});

@Injectable()
export class SteamService {
  private steam: SteamAuth;
  private appids_filter: string[] = ['774171', '774181', '960170', '977950', '1477590', '1802720']; // 추후 DB나 Redis로 이동
  private steamApiKey: string;
  constructor(private readonly configService: ConfigService) {
    this.steamApiKey = this.configService.get('STEAM_API_KEY');
    this.steam = new SteamAuth({
      realm: this.configService.get('STEAM_REALM'),
      returnUrl: this.configService.get('STEAM_RETURN_URL'),
      apiKey: this.steamApiKey,
    });
  }

  async getRedirectUrl() {
    return await this.steam.getRedirectUrl();
  }

  async authenticate(req) {
    return await this.steam.authenticate(req);
  }

  async calcSteamGameDevilRate(steamid: string) {
    const myGames = await this.getOwnedGames(steamid);
    const result = {};
    for (const key in myGames) {
      const g = myGames[key];
      const rate = g.achieved < 5 ? this.checkPlaytime(g.playtime) : this.checkAchieved(g.achieved);
      result[key] = {
        rate: rate,
        playtime: g.playtime,
        achieved: g.achieved,
      };
    }
    return result;
  }

  private async getOwnedGames(steamid: string): Promise<Record<string, SteamGameRating>> {
    const params = {
      key: this.steamApiKey,
      //   include_appinfo: true,
      format: 'json',
      steamid: steamid,
      appids_filter: this.appids_filter,
    };

    const results = {};

    try {
      const response = await axiosInstance.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`, {
        params,
      });
      const games: SteamGamePartial[] = response?.data?.response?.games ?? [];

      for (const game of games) {
        const { total, achieved } = await this.getGamesAchievements(steamid, game.appid);
        const playtime: number = game.playtime_forever; // 분 단위
        results[game.appid] = {
          playtime,
          achieved: ((achieved / total) * 100).toFixed(2),
        };
      }

      return results;
    } catch (err) {
      console.log(err);
    }
  }

  private async getGamesAchievements(steamid: string, appid: string | number): Promise<Record<string, number>> {
    const params = {
      appid,
      steamid,
      key: this.steamApiKey,
    };

    try {
      const response = await axiosInstance.get(
        `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/`,
        { params },
      );
      const playerstats = response.data.playerstats;
      const achievements: SteamGameAchievement[] = playerstats.achievements;
      return {
        achieved: achievements.filter(achievement => achievement.achieved === 1).length,
        total: achievements.length,
      };
    } catch (err) {
      console.log(err);
    }
  }

  private checkPlaytime(playtime: number) {
    playtime = playtime / 60;
    if (playtime < 10) return 1;
    if (playtime < 30) return 2;
    if (playtime < 100) return 3;
    return 4;
  }

  private checkAchieved(achieved: number) {
    if (achieved < 25) return 1;
    if (achieved < 50) return 2;
    if (achieved < 75) return 3;
    return 4;
  }
}
