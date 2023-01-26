import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../common/logger/logger.service';
import { EventService } from '../event/event.service';
import { User } from '../user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Video } from '../video/video.entity';
import { Comment } from './comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
		private readonly eventService: EventService,
		private readonly logger: LoggerService,
	) {}

	async findExistingComment(id: Comment['id']): Promise<Comment> {
		const comment = await this.commentRepository.findOne({ where: { id }, relations: { video: true } });

		if (!comment) {
			this.logger.warn(`comment with id '${id}' was not found`);
			throw new NotFoundException(`comment with id '${id}' was not found`);
		}

		return comment;
	}

	findComments(id: Video['id']): Promise<Comment[]> {
		this.logger.info(`finding comments for video with id '${id}'`);

		return this.commentRepository.find({
			where: { video: { id } },
			order: { createdAt: 'DESC' },
			relations: { user: true },
		});
	}

	createComment(user: User, video: Video, comment: CreateCommentDto): Promise<Comment> {
		this.logger.info('creating comment');

		return this.commentRepository.save({ ...comment, video, user });
	}

	async updateComment(id: Comment['id'], comment: UpdateCommentDto): Promise<Comment> {
		const existing = await this.findExistingComment(id);
		await this.commentRepository.save({ ...existing, content: comment.content });

		this.eventService.emit(`video-${existing.video.id}-comment`, { event: 'update' });

		return this.findExistingComment(id);
	}

	async deleteComment(id: Comment['id']): Promise<void> {
		const existing = await this.findExistingComment(id);
		await this.commentRepository.softDelete({ id });

		this.eventService.emit(`video-${existing.video.id}-comment`, { event: 'delete' });
	}
}
