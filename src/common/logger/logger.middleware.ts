import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private readonly logger: LoggerService) {}

	use(request: Request, response: Response, next: NextFunction): void {
		const action = `${request.method} ${request.baseUrl}`;

		const query = JSON.stringify(request.query).length > 2 ? `${JSON.stringify(request.query).length}` : '-';
		const body = JSON.stringify(request.body).length > 2 ? `${JSON.stringify(request.body).length}` : '-';

		const sizes = `${query} ${body}`;

		this.logger.request(`${action} ${sizes}`);
		next();
	}
}
