import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { createReadStream, statSync } from 'fs';
import { Repository } from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { CommentService } from '../comment/comment.service';
import { LoggerService } from '../common/logger/logger.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { VideoQueryFiltersDto } from './dto/video-query-filters.dto';
import { Video } from './video.entity';

@Injectable()
export class VideoService {
	constructor(
		@InjectRepository(Video) private readonly videoRepository: Repository<Video>,
		private readonly commentService: CommentService,
		private readonly userService: UserService,
		private readonly logger: LoggerService,
	) {}

	private relations = ['user'];

	private async findExistingVideo(id: Video['id']): Promise<Video> {
		const video = await this.videoRepository.findOne({ where: { id }, relations: this.relations });

		if (!video) {
			this.logger.warn(`video with id '${id}' was not found`);
			throw new NotFoundException(`video with id '${id}' was not found`);
		}

		return video;
	}

	findVideos(filters: VideoQueryFiltersDto): Promise<Video[]> {
		this.logger.info('finding all videos');

		const queryBuilder = this.videoRepository.createQueryBuilder('video').select();
		this.relations.forEach((relation) => {
			queryBuilder.leftJoinAndSelect(`video.${relation}`, relation);
		});
		queryBuilder.orderBy('video.likes', 'DESC');
		queryBuilder.addOrderBy('video.views', 'DESC');

		if (filters.title) {
			queryBuilder.where('video.title like :title', { title: `%${filters.title}%` });
		}
		if (filters.userId) {
			queryBuilder.andWhere('video.user_id = :userId', { userId: filters.userId });
		}

		return queryBuilder.getMany();
	}

	findVideo(id: Video['id']): Promise<Video> {
		this.logger.info(`finding video with id '${id}'`);

		return this.findExistingVideo(id);
	}

	async findComments(id: Video['id']): Promise<Comment[]> {
		await this.findExistingVideo(id);

		return this.commentService.findComments(id);
	}

	async createComment(username: User['username'], id: Video['id'], comment: CreateCommentDto): Promise<Comment> {
		const user = await this.userService.findUsername(username);
		const video = await this.findExistingVideo(id);

		return this.commentService.createComment(user, video, comment);
	}

	sendThumbnail(id: Video['id'], response: Response): void {
		this.logger.info(`finding thumbnail with id '${id}'`);

		try {
			const thumbnailPath = `src/assets/thumbnails/${id}.png`;
			createReadStream(thumbnailPath).pipe(response);
		} catch (err) {
			this.logger.error(err);
		}
	}

	async streamVideo(id: Video['id'], headers: Record<string, string | undefined>, response: Response): Promise<void> {
		this.logger.info(`streaming video with id '${id}'`);

		try {
			const videoPath = `src/assets/videos/${id}.mp4`;
			const { size } = statSync(videoPath);
			const videoRange = headers.range;

			if (videoRange) {
				const parts = videoRange.replace(/bytes=/, '').split('-');
				const start = parseInt(parts[0], 10);
				const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
				const chunksize = end - start + 1;
				const readStreamFile = createReadStream(videoPath, { start, end, highWaterMark: 60 });
				const head = { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': chunksize };

				response.writeHead(HttpStatus.PARTIAL_CONTENT, head);
				readStreamFile.pipe(response);
			} else {
				const head = { 'Content-Length': size };

				response.writeHead(HttpStatus.OK, head);
				createReadStream(videoPath).pipe(response);

				await this.videoRepository.increment({ id }, 'views', 1);
			}
		} catch (err) {
			this.logger.error(err);
		}
	}
}
