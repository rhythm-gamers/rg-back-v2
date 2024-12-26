export class CommonType {
  static TTL_MIN: number = 60;
  static TTL_HOUR: number = this.TTL_MIN * 60;
  static TTL_DAY: number = this.TTL_HOUR * 24;

  static TRUE: number = 1;
  static FALSE: number = 0;
}
