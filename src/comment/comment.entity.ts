import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MetadataEntity } from '../common/entities/metadata-entity';
import { User } from '../user/user.entity';
import { Video } from '../video/video.entity';

@Entity('comment')
export class Comment extends MetadataEntity {
	@Column({ length: 512 })
	content: string;

	@ManyToOne(() => Video, (video) => video.comments)
	@JoinColumn({ name: 'video_id' })
	video: Video;

	@ManyToOne(() => User, (user) => user.comments)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
