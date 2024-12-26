import { User } from '../entity/user.entity';

export class UserSimpleInfoDto {
  nickname: string;
  profileImage: string;

  constructor(user: User) {
    this.nickname = user.nickname;
    this.profileImage = user.profileImage;
  }
}
