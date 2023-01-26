import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { fromEvent, interval, map, merge, Observable } from 'rxjs';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class EventService {
	constructor(private readonly logger: LoggerService) {}

	private readonly emitter = new EventEmitter();

	subscribe(channel: string): Observable<unknown> {
		this.logger.debug(`subscribing to channel '${channel}'`);

		const heartbeat = interval(40000).pipe(map(() => ({ data: { event: 'heartbeat', data: null } })));
		const events = fromEvent(this.emitter, channel);

		return merge(heartbeat, events);
	}

	emit(channel: string, data: { event: 'heartbeat' | 'create' | 'update' | 'delete'; data?: unknown }): void {
		this.logger.debug(`emitting event '${data.event}' on channel '${channel}'`);
		this.emitter.emit(channel, { data });
	}
}
