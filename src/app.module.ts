import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule } from './common/config/config.module';
import { DatabaseModule } from './common/database/database.module';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { LoggerModule } from './common/logger/logger.module';
import { SchedulerModule } from './common/scheduler/scheduler.module';
import { ThrottleModule } from './common/throttle/throttle.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { VideoDislikeModule } from './video-dislike/video-dislike.module';
import { VideoLikeModule } from './video-like/video-like.module';
import { VideoModule } from './video/video.module';

@Module({
	imports: [
		ConfigModule,
		DatabaseModule,
		AuthModule,
		ThrottleModule,
		LoggerModule,
		SchedulerModule,
		EventModule,
		UserModule,
		VideoModule,
		VideoLikeModule,
		VideoDislikeModule,
		CommentModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
