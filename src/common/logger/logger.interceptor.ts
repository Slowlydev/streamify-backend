import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { coloredStatusCode } from '../utils/logger-colors.util';
import { toPlural } from '../utils/string-plural.util';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: LoggerService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const response = context.switchToHttp().getResponse() as Response;
		const statusCode = coloredStatusCode(response.statusCode);
		const target = response.req.url.includes('?')
			? response.req.url.split('?')[0].split('/').pop()
			: response.req.url.split('/').pop();

		return next.handle().pipe(
			tap((data?: unknown) => {
				if (Array.isArray(data) && data.length === 0) {
					this.logger.warn(`no ${toPlural(target ?? 'item')} found`);
					throw new HttpException(`no ${toPlural(target ?? 'item')} found`, HttpStatus.NO_CONTENT);
				}
				this.logger.response(`${statusCode} ${response.req.url} ${data ? JSON.stringify(data).length : '-'}`);
			}),
		);
	}
}
