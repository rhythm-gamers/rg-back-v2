import { User } from '../entity/user.entity';

export class UserDetailDto {
  id: string;
  nickname: string;

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
  }
}
