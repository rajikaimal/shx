import {Text} from 'ink';
import React, {useEffect} from 'react';
import {setup} from './setup.js';
import {useShxApi} from './use-shx-api.js';

type Config = {
	url: string | undefined;
	authToken: string | undefined;
};

type Props = {
	config: Config;
	message: string | undefined;
};

export default function App({config, message}: Props) {
	const {url, authToken} = config;
	const {reply, callWokerAI} = useShxApi({message});

	useEffect(() => {
		if (url && authToken) {
			// setup config at $HOME/.shxrc
			setup(url, authToken);
		} else {
			callWokerAI();
		}
	}, [url, authToken, message]);

	return (
		<>
			<Text color="green">{reply.map(r => r)}</Text>
		</>
	);
}
