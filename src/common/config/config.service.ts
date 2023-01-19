import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { DatabaseType } from 'typeorm';
import { LogLevel } from '../enums/log-level.enum';
import { Stage } from '../enums/stage.enum';

export interface EnvConfig {
	[key: string]: string;
}

export class ConfigService {
	private readonly envConfig: EnvConfig;

	constructor(filePath: string) {
		dotenv.config({ path: filePath });
		this.envConfig = this.validateEnv();
	}

	get name(): string {
		return String(this.envConfig.NAME);
	}

	get stage(): Stage {
		return String(this.envConfig.STAGE) as Stage;
	}

	get port(): number {
		return Number(this.envConfig.PORT);
	}

	get jwtSecret(): string {
		return String(this.envConfig.JWT_SECRET);
	}

	get jwtExpiry(): number {
		return Number(this.envConfig.JWT_EXPIRY);
	}

	get throttleTtl(): number {
		return Number(this.envConfig.THROTTLE_TTL);
	}

	get throttleLimit(): number {
		return Number(this.envConfig.THROTTLE_LIMIT);
	}

	get frontendUrl(): string {
		return String(this.envConfig.FRONTEND_URL);
	}

	get backendPrefix(): string {
		return String(this.envConfig.BACKEND_PREFIX);
	}

	get databaseHost(): string {
		return String(this.envConfig.DATABASE_HOST);
	}

	get databaseUsername(): string {
		return String(this.envConfig.DATABASE_USERNAME);
	}

	get databasePassword(): string {
		return String(this.envConfig.DATABASE_PASSWORD);
	}

	get databasePort(): number {
		return Number(this.envConfig.DATABASE_PORT);
	}

	get databaseName(): string {
		return String(this.envConfig.DATABASE_NAME);
	}

	get databaseType(): DatabaseType {
		return String(this.envConfig.DATABASE_TYPE) as DatabaseType;
	}

	get databaseSynchronize(): boolean {
		return Boolean(this.envConfig.DATABASE_SYNCHRONIZE);
	}

	get logRequests(): boolean {
		return Boolean(this.envConfig.LOG_REQUESTS);
	}

	get logResponses(): boolean {
		return Boolean(this.envConfig.LOG_RESPONSES);
	}

	get logLevel(): LogLevel {
		return String(this.envConfig.LOG_LEVEL) as LogLevel;
	}

	private validateEnv(): EnvConfig {
		const envVarsSchema: Joi.ObjectSchema = Joi.object({
			NAME: Joi.string().required(),
			STAGE: Joi.string()
				.required()
				.valid(...Object.values(Stage)),
			PORT: Joi.number().required(),

			JWT_SECRET: Joi.string().required(),
			JWT_EXPIRY: Joi.number().required(),

			THROTTLE_TTL: Joi.number().required(),
			THROTTLE_LIMIT: Joi.number().required(),

			FRONTEND_URL: Joi.string().required(),
			BACKEND_PREFIX: Joi.string().required(),

			DATABASE_HOST: Joi.string().required(),
			DATABASE_USERNAME: Joi.string().required(),
			DATABASE_PASSWORD: Joi.string().required(),
			DATABASE_NAME: Joi.string().required(),
			DATABASE_TYPE: Joi.string().required(),
			DATABASE_PORT: Joi.number().required(),
			DATABASE_SYNCHRONIZE: Joi.boolean().required(),

			LOG_REQUESTS: Joi.boolean().required(),
			LOG_RESPONSES: Joi.boolean().required(),
			LOG_LEVEL: Joi.string()
				.required()
				.valid(...Object.values(LogLevel)),
		});

		const { error, value: validatedEnvConfig } = envVarsSchema.validate(process.env, {
			allowUnknown: true,
		});

		if (error) {
			throw new Error(`config validation error: ${error.message}`);
		}

		return validatedEnvConfig;
	}
}
