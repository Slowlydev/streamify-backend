const regex = new RegExp(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);

export const pascalCase = (string: string): string => {
	return (
		string
			.match(regex)
			?.map((char: string) => char.charAt(0).toUpperCase() + char.slice(1).toLowerCase())
			.join('') ?? ''
	);
};

export const camelCase = (string: string): string => {
	return (
		string
			.match(regex)
			?.map((char: string) => char.charAt(0).toUpperCase() + char.slice(1).toLowerCase())
			.join('')
			.split('')
			.map((char: string, index: number) => (index === 0 ? char.toLowerCase() : char))
			.join('') ?? ''
	);
};

export const kebabCase = (string: string): string => {
	return (
		string
			.match(regex)
			?.map((char: string) => char.toLowerCase())
			.join('-') ?? ''
	);
};

export const snakeCase = (string: string): string => {
	return (
		string
			.match(regex)
			?.map((char: string) => char.toLowerCase())
			.join('_') ?? ''
	);
};
