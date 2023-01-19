import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { Repository } from 'typeorm';
import { LoggerService } from '../common/logger/logger.service';
import { hashPassword } from '../common/utils/hash-password.util';
import { Video } from '../video/video.entity';
import { VideoService } from '../video/video.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly videoService: VideoService,
		private readonly logger: LoggerService,
	) {}

	private async findExistingUser(id: User['id']): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id } });

		if (!user) {
			this.logger.warn(`user with id '${id}' was not found`);
			throw new NotFoundException(`user with id '${id}' was not found`);
		}

		return user;
	}

	findUser(id: User['id']): Promise<User> {
		this.logger.info(`finding user with id '${id}'`);

		return this.findExistingUser(id);
	}

	sendProfile(id: User['id'], response: Response): void {
		this.logger.info(`finding profile-image with id '${id}'`);

		try {
			const profilePath = `src/assets/profiles/${id}.png`;
			createReadStream(profilePath).pipe(response);
		} catch (err) {
			this.logger.error(err);
		}
	}

	async findVideos(id: User['id']): Promise<Video[]> {
		const user = await this.findExistingUser(id);

		return this.videoService.findVideos({}, user);
	}

	async updateUser(id: User['id'], updateRequest: UserUpdateDto): Promise<User> {
		this.logger.info(`updating user with id '${id}'`);

		const user = await this.findExistingUser(id);
		const existing = await this.userRepository.findOne({ where: { username: updateRequest.username } });

		if (user.username !== updateRequest.username && existing) {
			this.logger.warn(`user with username '${updateRequest.username}' already exists`);
			throw new ConflictException(`user with username '${updateRequest.username}' already exists`);
		}

		return this.userRepository.save({
			id,
			...updateRequest,
			password: updateRequest.password ? hashPassword(updateRequest.password) : undefined,
		});
	}

	async deleteUser(id: User['id']): Promise<void> {
		this.logger.info(`deleting user with id '${id}'`);

		await this.findExistingUser(id);
		await this.userRepository.softDelete(id);
	}
}
