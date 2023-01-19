import { Body, Controller, Delete, Get, Header, Param, Patch, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { authorization } from '../auth/auth.table';
import { Authentication } from '../common/decorators/authentication.decorator';
import { Authorization } from '../common/decorators/authorization.decorator';
import { BaseDto } from '../common/entities/base-dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Authentication()
@ApiTags('user')
@Controller('/user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id/profile-image')
	@Header('Accept-Ranges', 'bytes')
	@Header('Content-Type', 'image/png')
	getProfileImage(@Param() param: BaseDto, @Res() response: Response): void {
		return this.userService.sendProfile(param.id, response);
	}

	@Get(':id')
	getUser(@Param() param: BaseDto): Promise<User> {
		return this.userService.findUser(param.id);
	}

	@Authorization(authorization.user.update)
	@Patch(':id')
	putUser(@Param() param: BaseDto, @Body() body: UserUpdateDto): Promise<User> {
		return this.userService.updateUser(param.id, body);
	}

	@Authorization(authorization.user.delete)
	@Delete(':id')
	deleteUser(@Param() param: BaseDto): Promise<void> {
		return this.userService.deleteUser(param.id);
	}
}
