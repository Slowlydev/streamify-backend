import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
	@IsString()
	@MinLength(8)
	@MaxLength(512)
	content: string;
}
