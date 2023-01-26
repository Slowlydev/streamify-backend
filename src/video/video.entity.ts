import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { MetadataEntity } from '../common/entities/metadata-entity';
import { User } from '../user/user.entity';
import { VideoDislike } from '../video-dislike/video-dislike.entity';
import { VideoLike } from '../video-like/video-like.entity';

@Entity('video')
export class Video extends MetadataEntity {
	@Column({ length: 32 })
	title: string;

	@Column({ length: 2048 })
	description: string;

	@Column({ type: 'int' })
	views: number;

	@OneToMany(() => VideoLike, (videoLike) => videoLike.video)
	likedBy: VideoLike[];

	@OneToMany(() => VideoDislike, (videoDislikes) => videoDislikes.video)
	dislikedBy: VideoDislike[];

	@ManyToOne(() => User, (user) => user.videos)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@OneToMany(() => Comment, (comment) => comment.video)
	comments: Comment[];
}
