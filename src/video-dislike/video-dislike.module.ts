import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoDislike } from './video-dislike.entity';
import { VideoDislikeService } from './video-dislike.service';

@Module({
	imports: [TypeOrmModule.forFeature([VideoDislike])],
	providers: [VideoDislikeService],
	exports: [VideoDislikeService],
})
export class VideoDislikeModule {}
