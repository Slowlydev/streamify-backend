import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';
import { User } from '../../user/user.entity';
import { Video } from '../video.entity';

export class VideoQueryFiltersDto {
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(32)
	@Matches(/^[a-zA-Z0-9 -]+$/)
	title?: Video['title'];

	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	@IsUUID()
	userId?: User['id'];

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	skip?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	take?: number;
}
