import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { User } from '../../user/user.entity';

export class UserSignupDto {
	@ApiProperty({ type: String })
	@IsString()
	@MinLength(4)
	@MaxLength(32)
	@Matches(/^[a-zA-Z0-9-]+$/)
	username: User['username'];

	@ApiProperty({ type: String })
	@IsString()
	@MinLength(4)
	@MaxLength(64)
	password: User['password'];
}
