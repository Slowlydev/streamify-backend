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

	async saveDislike(videoId: Video['id'], userId: User['id']): Promise<void> {
		await this.videoDislikeRepository
			.createQueryBuilder()
			.insert()
			.into(VideoDislike)
			.values({ video: { id: videoId }, user: { id: userId } })
			.execute();
	}
}
