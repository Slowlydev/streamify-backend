import { IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';
import { User } from '../../user/user.entity';
import { Video } from '../video.entity';

export class VideoQueryFiltersDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(32)
	@Matches(/^[a-zA-Z0-9 -]+$/)
	title?: Video['title'];

	@IsOptional()
	@IsString()
	@IsUUID()
	userId?: User['id'];
}
