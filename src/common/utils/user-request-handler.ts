import { User } from 'src/user/entity/user.entity';

// export function getUserFromRequest(req): User {
//   return req.user;
// }

// export function setUserToRequest(req, user): void {
//   req.user = user;
// }

export const getUserFromRequest = (req): User => req.user;
export const setUserToRequest = (req, user): void => {
  req.user = user;
};
