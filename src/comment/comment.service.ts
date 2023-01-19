import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from '../video/video.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '../common/logger/logger.service';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
		private readonly logger: LoggerService,
	) {}

	findComments(id: Video['id']): Promise<Comment[]> {
		return this.commentRepository.find({ where: { video: { id } } });
	}
}
