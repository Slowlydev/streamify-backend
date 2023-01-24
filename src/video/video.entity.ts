import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { MetadataEntity } from '../common/entities/metadata-entity';
import { User } from '../user/user.entity';

@Entity('video')
export class Video extends MetadataEntity {
	@Column({ length: 32 })
	title: string;

	@Column({ length: 2048 })
	description: string;

	@Column({ type: 'int' })
	views: number;

	@Column({ type: 'int' })
	likes: number;

	@Column({ type: 'int' })
	dislikes: number;

	@ManyToOne(() => User, (user) => user.videos)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@OneToMany(() => Comment, (comment) => comment.video)
	comments: Comment[];
}
