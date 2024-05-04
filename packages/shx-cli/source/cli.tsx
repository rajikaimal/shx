#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ shx

	Examples
      $ shx "how to stop a docker container"
      $ docker stop <container_id>

	To setup
	  $ shx --url="<worker_uri>" authToken="username:password"
`,
	{
		importMeta: import.meta,
		flags: {
			url: {
				type: 'string',
			},
			authToken: {
				type: 'string',
			},
		},
	},
);

render(
	<App
		config={{url: cli.flags.url, authToken: cli.flags.authToken}}
		message={cli.input[0]}
	/>,
);
