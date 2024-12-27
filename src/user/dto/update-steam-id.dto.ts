import { IsString } from 'class-validator';

export class UpdateSteamIdDto {
  @IsString()
  steamid: string;
}
