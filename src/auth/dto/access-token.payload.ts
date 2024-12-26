export class AccessTokenPayload {
  id: string;
  nickname: string;

  constructor(id: string, nickname: string) {
    this.id = id;
    this.nickname = nickname;
  }
}
