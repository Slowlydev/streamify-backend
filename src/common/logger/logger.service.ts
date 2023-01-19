import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { LogLevel } from '../enums/log-level.enum';
import { blue, bold, cyan, green, red, reset, yellow } from '../utils/logger-colors.util';
import { kebabCase } from '../utils/string-cases.util';

@Injectable()
export class LoggerService {
	constructor(
		@Inject('LOGGER_CONTEXT') private readonly loggerContext: string,
		private readonly configService: ConfigService,
	) {}

	private logger(level: LogLevel, message: string, context?: string): string {
		const now = new Date();

		const year = `${now.getUTCFullYear()}`;
		const month = `${now.getUTCMonth() >= 10 ? now.getUTCMonth() : `0${now.getUTCMonth()}`}`;
		const day = `${now.getUTCDate() >= 10 ? now.getUTCDate() : `0${now.getUTCDate()}`}`;

		const date = `${year}/${month}/${day}`;

		const hours = `${now.getUTCHours() >= 10 ? now.getUTCHours() : `0${now.getUTCHours()}`}`;
		const minutes = `${now.getUTCMinutes() >= 10 ? now.getUTCMinutes() : `0${now.getUTCMinutes()}`}`;
		const seconds = `${now.getUTCSeconds() >= 10 ? now.getUTCSeconds() : `0${now.getUTCSeconds()}`}`;

		const time = `${hours}:${minutes}:${seconds}`;

		const timestamp = `${date} ${time}`;

		const name = this.configService.name;
		const stage = this.configService.stage;

		const base = `${bold}[${blue}${bold}${name}${reset}${bold}]${reset} (${stage}) ${timestamp}`;

		switch (level) {
			case LogLevel.REQUEST:
				return `${base} ${LogLevel.REQUEST}: ${message}`;
			case LogLevel.RESPONSE:
				return `${base} ${LogLevel.RESPONSE}: ${message}`;
			case LogLevel.DEBUG:
				return `${base} ${cyan}${LogLevel.DEBUG}${reset}:${context ? ` [${kebabCase(context)}] ` : ' '}${message}`;
			case LogLevel.LOG:
				return `${base} ${green}${LogLevel.LOG}${reset}:${context ? ` ${context} ` : ' '}${message}`;
			case LogLevel.INFO:
				return `${base} ${green}${LogLevel.INFO}${reset}:${context ? ` [${kebabCase(context)}] ` : ' '}${message}`;
			case LogLevel.WARN:
				return `${base} ${yellow}${LogLevel.WARN}${reset}:${context ? ` [${kebabCase(context)}] ` : ' '}${message}`;
			case LogLevel.ERROR:
				return `${base} ${red}${LogLevel.ERROR}${reset}:${context ? ` [${kebabCase(context)}] ` : ' '}${message}`;
		}
	}

	request(message: string): void {
		this.configService.logRequests && console.log(this.logger(LogLevel.REQUEST, message));
	}

	response(message: string): void {
		this.configService.logResponses && console.log(this.logger(LogLevel.RESPONSE, message));
	}

	debug(message: string): void {
		const levels: LogLevel[] = [LogLevel.DEBUG];
		levels.includes(this.configService.logLevel) &&
			console.debug(this.logger(LogLevel.DEBUG, message, this.loggerContext));
	}

	info(message: string): void {
		const levels: LogLevel[] = [LogLevel.DEBUG, LogLevel.INFO];
		levels.includes(this.configService.logLevel) &&
			console.info(this.logger(LogLevel.INFO, message, this.loggerContext));
	}

	log(message: string, context: string): void {
		const levels: LogLevel[] = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.LOG];
		levels.includes(this.configService.logLevel) && console.log(this.logger(LogLevel.LOG, message, context));
	}

	warn(message: string, stacktrace?: unknown): void {
		const levels: LogLevel[] = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.LOG, LogLevel.WARN];
		if (stacktrace) {
			levels.includes(this.configService.logLevel) &&
				console.warn(this.logger(LogLevel.WARN, message, this.loggerContext), stacktrace);
		} else {
			levels.includes(this.configService.logLevel) &&
				console.warn(this.logger(LogLevel.WARN, message, this.loggerContext));
		}
	}

	error(message: string, stacktrace?: unknown): void {
		const levels: LogLevel[] = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.LOG, LogLevel.WARN, LogLevel.ERROR];
		if (stacktrace) {
			levels.includes(this.configService.logLevel) &&
				console.error(this.logger(LogLevel.ERROR, message, this.loggerContext), stacktrace);
		} else {
			levels.includes(this.configService.logLevel) &&
				console.error(this.logger(LogLevel.ERROR, message, this.loggerContext));
		}
	}
}
