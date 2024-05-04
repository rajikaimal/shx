import {createConfigFile} from './fs.js';

export const setup = async (url: string, userAndPassword: string) => {
	try {
		const authToken = btoa(userAndPassword);
		await createConfigFile(url, authToken);
	} catch (e) {
		console.error(e);
		throw e;
	}
};
