import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Video } from '../video/video.entity';
import { VideoDislike } from './video-dislike.entity';

@Injectable()
export class VideoDislikeService {
	constructor(@InjectRepository(VideoDislike) private readonly videoDislikeRepository: Repository<VideoDislike>) {}

	countDislikes(id: Video['id']): Promise<number> {
		return this.videoDislikeRepository
			.createQueryBuilder('dislikes')
			.select()
			.where('dislikes.video = :videoId', { videoId: id })
			.getCount();
	}

	async dislikedByUser(videoId: Video['id'], userId: User['id']): Promise<boolean> {
		return (
			(await this.videoDislikeRepository
				.createQueryBuilder('dislikes')
				.select()
				.where('dislikes.user = :userId', { userId })
				.andWhere('dislikes.video = :videoId', { videoId })
				.getCount()) > 0
		);
	}

	async toggleDislike(videoId: Video['id'], userId: User['id']): Promise<void> {
		if (await this.dislikedByUser(videoId, userId)) {
			await this.videoDislikeRepository.delete({ video: { id: videoId }, user: { id: userId } });
			return;
		}
		await this.videoDislikeRepository
			.createQueryBuilder()
			.insert()
			.into(VideoDislike)
			.values({ video: { id: videoId }, user: { id: userId } })
			.execute();
	}
}
