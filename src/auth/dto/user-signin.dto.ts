import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { User } from '../../user/user.entity';

export class UserSigninDto {
	@ApiProperty({ type: String })
	@IsString()
	@MinLength(4)
	@MaxLength(32)
	username: User['username'];

	@ApiProperty({ type: String })
	@IsString()
	@MinLength(4)
	@MaxLength(64)
	password: User['password'];
}
