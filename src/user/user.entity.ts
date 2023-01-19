import { Column, Entity, OneToMany } from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { MetadataEntity } from '../common/entities/metadata-entity';
import { Language } from '../common/enums/language.enum';
import { Theme } from '../common/enums/theme.enum';
import { Video } from '../video/video.entity';

@Entity('user')
export class User extends MetadataEntity {
	@Column({ unique: true, length: 32 })
	username: string;

	@Column({ length: 64, select: false })
	password: string;

	@Column({ type: 'enum', enum: Language })
	language: Language;

	@Column({ type: 'enum', enum: Theme })
	theme: Theme;

	@OneToMany(() => Video, (video) => video.user)
	videos: Video[];

	@OneToMany(() => Comment, (comment) => comment.user)
	comments: Comment[];
}
