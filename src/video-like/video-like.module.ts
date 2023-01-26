import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoLike } from './video-like.entity';
import { VideoLikeService } from './video-like.service';

@Module({
	imports: [TypeOrmModule.forFeature([VideoLike])],
	providers: [VideoLikeService],
	exports: [VideoLikeService],
})
export class VideoLikeModule {}
