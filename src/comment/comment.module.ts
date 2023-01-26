import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../common/config/config.module';
import { LoggerService } from '../common/logger/logger.service';
import { EventModule } from '../event/event.module';
import { User } from '../user/user.entity';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, Comment]), ConfigModule, EventModule],
	providers: [CommentService, LoggerService, { provide: 'LOGGER_CONTEXT', useValue: CommentService.name }],
	controllers: [CommentController],
	exports: [CommentService],
})
export class CommentModule {}
