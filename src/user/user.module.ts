import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../common/config/config.module';
import { LoggerService } from '../common/logger/logger.service';
import { VideoModule } from '../video/video.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([User]), ConfigModule, VideoModule],
	providers: [UserService, LoggerService, { provide: 'LOGGER_CONTEXT', useValue: UserService.name }],
	controllers: [UserController],
})
export class UserModule {}
