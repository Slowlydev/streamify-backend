import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { AuthTable } from '../../auth/auth.table';

@Injectable()
export class UserGuard implements CanActivate {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly entityManager: EntityManager,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const users = this.reflector.get<AuthTable['']['']['users']>('allowedUsers', context.getHandler());

			if (!users) {
				return false;
			}

			const request = context.switchToHttp().getRequest();
			const currentUser = await this.userRepository.findOne({
				where: { username: request.user.username },
			});

			if (!currentUser) {
				return false;
			}

			if (!request.params.id) {
				return false;
			}

			// we get the target entity from the database with all its relations which are given in the authorization table
			const target = await this.entityManager.findOne(users[0].split('.')[0], {
				where: { id: request.params.id },
				relations: users.map((user) => user.split('.').splice(1).join('.')).filter((elm) => elm !== ''),
			});

			// we take the target which is a potentially deeply nested object and search it recursively for user objects
			// all user objects we find will get pushed to the allowed users array which represents all users the
			// target has relations to and which are specified in the authorization table
			let allowedUsers: User[] = [];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const recursion = (values: any): void => {
				if (typeof values === 'object' && values && values.username) {
					allowedUsers.push(values);
				} else if (typeof values === 'object' && values) {
					const array = Object.values(values);
					array.forEach((value) => recursion(value));
				} else if (Array.isArray(values)) {
					values.forEach((value) => recursion(value));
				}
			};
			recursion(target);

			// this filters duplicated users from allowed users
			allowedUsers = allowedUsers.filter(
				(value, index, self) => index === self.findIndex((employee) => employee.id === value.id),
			);

			if (allowedUsers.some((user) => user.username === currentUser.username)) {
				return true;
			}

			return false;
		} catch {
			return false;
		}
	}
}
