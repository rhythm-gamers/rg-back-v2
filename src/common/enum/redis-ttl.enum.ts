export enum RedisTTL {
  TTL_MIN = 60,
  TTL_HOUR = RedisTTL.TTL_MIN * 60,
  TTL_DAY = RedisTTL.TTL_HOUR * 24,
}
