import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../comment/comment.entity';
import { MetadataDto } from '../../common/entities/metadata-dto';
import { User } from '../../user/user.entity';

export class VideoDto extends MetadataDto {
	@ApiProperty({ type: String })
	title: string;

	@ApiProperty({ type: String })
	description: string;

	@ApiProperty({ type: Number })
	views: number;

	@ApiProperty({ type: Number })
	likes: number;

	@ApiProperty({ type: Number })
	dislikes: number;

	@ApiProperty({ type: Boolean })
	liked: boolean;

	@ApiProperty({ type: Boolean })
	disliked: boolean;

	@ApiProperty({ type: User })
	user: User;

	@ApiProperty({ type: [Comment] })
	comments: Comment[];
}
