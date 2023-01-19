import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../common/logger/logger.service';
import { User } from '../user/user.entity';
import { CreateCommentDto } from '../video/dto/create-comment.dto';
import { Video } from '../video/video.entity';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
		private readonly logger: LoggerService,
	) {}

	findComments(id: Video['id']): Promise<Comment[]> {
		this.logger.info(`finding comments for video with id '${id}'`);

		return this.commentRepository.find({ where: { video: { id } } });
	}

	createComment(user: User, video: Video, comment: CreateCommentDto): Promise<Comment> {
		this.logger.info('creating comment');

		return this.commentRepository.save({ ...comment, video, user });
	}
}
