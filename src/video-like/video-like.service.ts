import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Video } from '../video/video.entity';
import { VideoLike } from './video-like.entity';

@Injectable()
export class VideoLikeService {
	constructor(@InjectRepository(VideoLike) private readonly videoLikeRepository: Repository<VideoLike>) {}

	countLikes(id: Video['id']): Promise<number> {
		return this.videoLikeRepository
			.createQueryBuilder('likes')
			.select()
			.where('likes.video = :videoId', { videoId: id })
			.getCount();
	}

	async saveLike(videoId: Video['id'], userId: User['id']): Promise<void> {
		await this.videoLikeRepository
			.createQueryBuilder()
			.insert()
			.into(VideoLike)
			.values({ video: { id: videoId }, user: { id: userId } })
			.execute();
	}
}
