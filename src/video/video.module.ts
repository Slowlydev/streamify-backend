import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../common/config/config.module';
import { LoggerService } from '../common/logger/logger.service';
import { User } from '../user/user.entity';
import { VideoController } from './video.controller';
import { Video } from './video.entity';
import { VideoService } from './video.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, Video]), ConfigModule],
	providers: [VideoService, LoggerService, { provide: 'LOGGER_CONTEXT', useValue: VideoService.name }],
	controllers: [VideoController],
})
export class VideoModule {}
