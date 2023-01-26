import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Language } from '../../common/enums/language.enum';
import { Theme } from '../../common/enums/theme.enum';
import { User } from '../user.entity';

export class UserUpdateDto {
	@ApiProperty({ type: String })
	@IsString()
	@MinLength(4)
	@MaxLength(32)
	@Matches(/^[a-zA-Z0-9-]+$/)
	username: User['username'];

	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	@MinLength(8)
	@MaxLength(64)
	@Matches(/(?=(.*[0-9]){2})/)
	@Matches(/(?=(.*[a-z]){2})/)
	@Matches(/(?=(.*[A-Z]){2})/)
	password?: User['password'];

	@ApiProperty({ enum: Language, required: false })
	@IsOptional()
	@IsEnum(Language)
	language?: Language;

	@ApiProperty({ enum: Theme, required: false })
	@IsOptional()
	@IsEnum(Theme)
	theme?: Theme;
}
