export const blue = `\x1b[34m`;
export const cyan = `\x1b[36m`;
export const green = `\x1b[32m`;
export const yellow = '\x1b[33m';
export const red = `\x1b[31m`;
export const bold = `\x1b[1m`;
export const reset = `\x1b[0m`;

export const coloredStatusCode = (statusCode: number): string => {
	if (statusCode >= 500) {
		return `${red}${statusCode}${reset}`;
	} else if (statusCode >= 400) {
		return `${yellow}${statusCode}${reset}`;
	} else if (statusCode >= 300) {
		return `${blue}${statusCode}${reset}`;
	} else if (statusCode >= 200) {
		return `${green}${statusCode}${reset}`;
	} else if (statusCode >= 100) {
		return `${cyan}${statusCode}${reset}`;
	} else {
		return `${statusCode}`;
	}
};
