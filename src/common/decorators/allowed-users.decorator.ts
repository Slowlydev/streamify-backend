import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { AuthTable } from '../../auth/auth.table';

export const AllowedUsers = (allowedUsers: AuthTable['']['']['users']): CustomDecorator<string> =>
	SetMetadata('allowedUsers', allowedUsers);
