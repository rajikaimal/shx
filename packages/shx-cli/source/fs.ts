import {readFile, writeFile} from 'node:fs/promises';
import {homedir} from 'node:os';

export const configFilePath = `${homedir}/.shxrc`;

export const readConfigFile = async () => {
	try {
		const file = await readFile(configFilePath, {encoding: 'utf8'});
		const configs = file.split('\n');
		const url = configs[0]?.split('=')[1];
		const authToken = configs[1]?.split('=')[1];

		return {url, authToken};
	} catch (e) {
		console.error(e);
		throw e;
	}
};

export const createConfigFile = async (url: string, authToken: string) => {
	try {
		const config = `url=${url}\nauthToken=${authToken}`;
		await writeFile(configFilePath, config);
	} catch (e) {
		console.error(e);
		throw e;
	}
};
