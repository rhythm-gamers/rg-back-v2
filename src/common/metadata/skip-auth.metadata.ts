import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_KEY = 'public';
export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
