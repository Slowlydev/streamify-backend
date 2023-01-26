export type AuthTable = {
	[key: string]: {
		[key: string]: {
			users: string[] | null;
		};
	};
};

export const authorization: AuthTable = {
	user: {
		update: {
			users: ['user'],
		},
		delete: {
			users: ['user'],
		},
	},
	comment: {
		update: {
			users: ['comment.user'],
		},
		delete: {
			users: ['comment.user'],
		},
	},
};
