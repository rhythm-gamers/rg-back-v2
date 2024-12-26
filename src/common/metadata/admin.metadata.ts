import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enum/user-role.enum';

export const ADMIN_KEY = UserRole.ADMIN;
export const Admin = () => SetMetadata(ADMIN_KEY, true);
