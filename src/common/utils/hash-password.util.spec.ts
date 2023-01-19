import { hashPassword } from './hash-password.util';

describe('hashPassword', () => {
	it('should hash the password', () => {
		expect(hashPassword).toBeDefined();
		expect(hashPassword).toBeInstanceOf(Function);
		expect(typeof hashPassword('hello')).toBe('string');
		expect(hashPassword('hello').length).toEqual(64);

		expect(hashPassword('lorem')).toEqual('3400bb495c3f8c4c3483a44c6bc1a92e9d94406db75a6f27dbccc11c76450d8a');
		expect(hashPassword('ipsum')).toEqual('0417c537e65d8e41ee92b7257726086854a8f41cd884842f52dcf05caf4109a4');
		expect(hashPassword('dolor')).toEqual('67f047db155161e99851908ba03fe13c23320f561940787b5e94e8fe7adefda5');
		expect(hashPassword('quad')).toEqual('2522fb7024fe0a83e6b92bc6a641369630f57dfea236a7f59be43cb7f86a4a2a');
		expect(hashPassword('erat')).toEqual('e806ddc0bf66b8caa0555eed38881e0c7f15afa9e0fb06767c26daec4cbadc2d');
	});
});
