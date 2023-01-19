import { Module } from '@nestjs/common';
import { ConfigModule } from '../common/config/config.module';
import { LoggerService } from '../common/logger/logger.service';
import { EventService } from './event.service';

@Module({
	imports: [ConfigModule],
	providers: [EventService, LoggerService, { provide: 'LOGGER_CONTEXT', useValue: EventService.name }],
	exports: [EventService],
})
export class EventModule {}
