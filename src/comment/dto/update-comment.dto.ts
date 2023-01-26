import { IsString, MaxLength, MinLength } from 'class-validator';
import { Comment } from '../comment.entity';

export class UpdateCommentDto {
	@IsString()
	@MinLength(8)
	@MaxLength(512)
	content: Comment['content'];
}
