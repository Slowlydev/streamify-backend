/* eslint-disable @typescript-eslint/no-floating-promises */
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import pack from '../package.json';
import { AppModule } from './app.module';
import { ConfigModule } from './common/config/config.module';
import { ConfigService } from './common/config/config.service';
import { LoggingFilter } from './common/logger/logger.filter';
import { LoggingInterceptor } from './common/logger/logger.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { LoggerService } from './common/logger/logger.service';

const bootstrap = async (): Promise<void> => {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	const configService = app.select(ConfigModule).get(ConfigService, { strict: true });
	const loggerService = app.select(LoggerModule).get(LoggerService, { strict: true });

	const options = new DocumentBuilder()
		.setTitle(configService.name)
		.setVersion(pack.version)
		.setDescription(pack.description)
		.addBearerAuth()
		.addServer('/api')
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup(`${configService.backendPrefix}docs`, app, document);

	app.setGlobalPrefix(configService.backendPrefix);
	app.enableCors({ origin: configService.frontendUrl, credentials: true });

	app.useLogger(loggerService);
	app.use(compression());
	app.use(helmet());
	app.use(
		helmet.hsts({
			maxAge: 31536000,
			includeSubDomains: true,
		}),
		helmet.crossOriginResourcePolicy({
			policy: 'cross-origin',
		}),
	);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			forbidUnknownValues: true,
			skipNullProperties: false,
			skipMissingProperties: false,
			transform: true,
			transformOptions: {
				exposeDefaultValues: true,
			},
		}),
	);

	const { httpAdapter } = app.get(HttpAdapterHost);

	app.useGlobalInterceptors(new LoggingInterceptor(loggerService));
	app.useGlobalFilters(new LoggingFilter(httpAdapter, loggerService));

	await app.listen(configService.port);
};

bootstrap();
