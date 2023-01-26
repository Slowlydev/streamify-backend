import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base-entity';
import { User } from '../user/user.entity';
import { Video } from '../video/video.entity';

@Entity('video_like')
export class VideoLike extends BaseEntity {
	@ManyToOne(() => Video, (video) => video.dislikedBy)
	@JoinColumn({ name: 'video_id' })
	video: Video;

	@ManyToOne(() => User, (user) => user.likedVideos)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
