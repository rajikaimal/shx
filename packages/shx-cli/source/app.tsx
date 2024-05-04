import {Text} from 'ink';
import Spinner from 'ink-spinner';
import React, {useEffect, useState} from 'react';
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
	const {reply, callWorkerAI} = useShxApi({message});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (url && authToken) {
			// setup config at $HOME/.shxrc
			setup(url, authToken);
			setIsLoading(false);
			console.log('\nSetup successful!');
		} else {
			callWorkerAI();
		}
	}, [url, authToken, message]);

	useEffect(() => {
		if (reply?.length) setIsLoading(false);
	}, [reply]);

	const render = () => {
		if (isLoading) {
			return <Spinner type="dots" />;
		} else {
			return <Text color="green">{reply.map(r => r)}</Text>;
		}
	};

	return <>{render()}</>;
}
