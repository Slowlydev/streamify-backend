import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LoggerService } from './logger.service';

@Module({
	imports: [ConfigModule],
	providers: [LoggerService, { provide: 'LOGGER_CONTEXT', useValue: LoggerService.name }],
	controllers: [],
	exports: [LoggerService],
})
export class LoggerModule {}
