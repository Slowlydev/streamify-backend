import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { LoggerService } from '../common/logger/logger.service';
import { hashPassword } from '../common/utils/hash-password.util';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
		private readonly logger: LoggerService,
	) {}

	async validate(username: User['username'], password: User['password']): Promise<User> {
		this.logger.debug(`validating user with username '${username}'`);

		const user = await this.userRepository.findOne({ where: { username, password: hashPassword(password) } });

		if (!user) {
			this.logger.warn(`user with username '${username}' provided invalid password`);
			throw new UnauthorizedException('invalid credentials');
		}

		return user;
	}

	async signup(username: User['username'], password: User['password']): Promise<User> {
		this.logger.info(`user with username '${username}' signed up`);

		const existing = await this.userRepository.findOne({ where: { username } });

		if (existing) {
			this.logger.warn(`user with username '${username}' already exists`);
			throw new ConflictException(`user with username '${username}' already exists`);
		}

		return this.userRepository.save({ username, password: hashPassword(password) });
	}

	signin(username: User['username'], password: User['password']): { access_token: string } {
		this.logger.info(`user with username '${username}' logged in`);

		return { access_token: this.jwtService.sign({ username, password }) };
	}

	find(username: User['username']): Promise<User | null> {
		this.logger.debug(`finding user with username '${username}'`);

		return this.userRepository.findOne({ where: { username } });
	}
}
