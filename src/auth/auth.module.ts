import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { ConfigModule } from '../common/config/config.module';
import { ConfigService } from '../common/config/config.service';
import { LoggerService } from '../common/logger/logger.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.jwtSecret,
				signOptions: { expiresIn: configService.jwtExpiry },
			}),
			inject: [ConfigService],
		}),
		ConfigModule,
	],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		LoggerService,
		{ provide: 'LOGGER_CONTEXT', useValue: AuthService.name },
	],
	controllers: [AuthController],
})
export class AuthModule {}
