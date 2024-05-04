import {useState} from 'react';
import {readConfigFile} from './fs.js';

export const useShxApi = ({message}: {message: string | undefined}) => {
	const [reply, setReply] = useState<string[]>([]);

	const callWokerAI = async () => {
		try {
			const {url, authToken} = await readConfigFile();

			if (!authToken) {
				console.log('auth token not found!');
				return;
			}

			const resp = await fetch(url as string, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Basic ${authToken}`,
				},
				body: JSON.stringify({message}),
			});

			if (!resp.ok) {
				console.error('Error in Worker response');
			}

			const reader = resp?.body
				?.pipeThrough(new TextDecoderStream())
				.getReader();

			if (!reader) return;

			while (true) {
				// eslint-disable-next-line no-await-in-loop
				const {value, done} = await reader.read();
				if (done) break;
				let dataDone = false;
				const tokens = value.split('\n');
				tokens.forEach(data => {
					if (data.length === 0) return; // ignore empty message
					if (data.startsWith(':')) return;
					if (data === 'data: [DONE]') {
						dataDone = true;
						return;
					}
					const json = JSON.parse(data.substring(6));
					setReply(reply => [...reply, json.response]);
				});

				if (dataDone) break;
			}
		} catch (e) {
			console.error(e);
		}
	};

	return {reply, callWokerAI};
};
