import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enum/user-role.enum';

export const MAINTAINER_KEY = UserRole.MAINTAIN;
export const Maintainer = () => SetMetadata(MAINTAINER_KEY, true);
