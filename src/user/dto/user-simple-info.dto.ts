export class UserSimpleInfoDto {
  nickname: string;
  profileImage: string;

  constructor(nickname: string, profileImage: string) {
    this.nickname = nickname;
    this.profileImage = profileImage;
  }
}
