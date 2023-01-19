import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';
import { coloredStatusCode } from '../utils/logger-colors.util';
import { LoggerService } from './logger.service';

@Catch()
export class LoggingFilter extends BaseExceptionFilter {
	constructor(applicationRef: AbstractHttpAdapter, private readonly logger: LoggerService) {
		super(applicationRef);
	}

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest() as Request;

		const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const statusCode = coloredStatusCode(httpStatus);

		this.logger.response(`${statusCode} ${request.baseUrl}`);

		super.catch(exception, host);
	}
}
