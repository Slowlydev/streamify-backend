import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Video } from '../video.entity';

export class VideoQueryFiltersDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(32)
	@Matches(/^[a-zA-Z0-9 -]+$/)
	title?: Video['title'];
}
