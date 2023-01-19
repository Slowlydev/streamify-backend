import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthTable } from '../../auth/auth.table';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserGuard } from '../guards/user.guard';
import { AllowedUsers } from './allowed-users.decorator';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const Authorization = (permissions: AuthTable['']['']) => {
	return applyDecorators(AllowedUsers(permissions.users), UseGuards(JwtAuthGuard, UserGuard), ApiBearerAuth());
};
