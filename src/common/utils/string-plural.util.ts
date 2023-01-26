export const toPlural = (string: string): string => {
	return string.endsWith('y')
		? `${string
				.split('')
				.splice(0, string.length - 1)
				.join('')}ies`
		: `${string}s`;
};
