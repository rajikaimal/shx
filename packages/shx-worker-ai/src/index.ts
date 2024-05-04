import { Buffer } from 'node:buffer';

export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "AI" with the variable name you defined.
	AI: any;
	user: string;
	pwd: string;
}

type Message = {
	message: string;
};

const encoder = new TextEncoder();

/**
 * Protect against timing attacks by safely comparing values using `timingSafeEqual`.
 * Refer to https://developers.cloudflare.com/workers/runtime-apis/web-crypto/#timingsafeequal for more details
 */
function timingSafeEqual(a: string, b: string) {
	const aBytes = encoder.encode(a);
	const bBytes = encoder.encode(b);

	if (aBytes.byteLength !== bBytes.byteLength) {
		// Strings must be the same length in order to compare
		// with crypto.subtle.timingSafeEqual
		return false;
	}

	return crypto.subtle.timingSafeEqual(aBytes, bBytes);
}

const invalidAuthMsg = 'Invalid authentication';

export default {
	async fetch(request, env): Promise<Response> {
		const req = (await request.json()) as Message;
		const msg = req.message;
		const authorization = request.headers.get('Authorization');

		if (!authorization) {
			return new Response(invalidAuthMsg, {
				status: 401,
				headers: {
					// Prompts the user for credentials.
					'WWW-Authenticate': 'Basic realm="my scope", charset="UTF-8"',
				},
			});
		}

		const [scheme, encoded] = authorization.split(' ');
		// The Authorization header must start with Basic, followed by a space.
		if (!encoded || scheme !== 'Basic') {
			return new Response('Malformed authorization header.', {
				status: 400,
			});
		}

		const credentials = Buffer.from(encoded, 'base64').toString();

		const index = credentials.indexOf(':');
		const user = credentials.substring(0, index);
		const pass = credentials.substring(index + 1);

		const BASIC_USER = env.user;
		const BASIC_PWD = env.pwd;

		if (!timingSafeEqual(BASIC_USER, user) || !timingSafeEqual(BASIC_PWD, pass)) {
			return new Response(invalidAuthMsg, {
				status: 401,
				headers: {
					// Prompts the user for credentials.
					'WWW-Authenticate': 'Basic realm="my scope", charset="UTF-8"',
				},
			});
		}

		const stream = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
			stream: true,
			max_tokens: 512,
			messages: [
				{
					role: 'system',
					content: `You're 'shx', a command line assisant tool which can help to quickly provide commands based
on the prompt asked by the user using a few liners.
Don't provide code or markdown. Should be less verbose and on-point.

Examples:

User input: 
'how to run a node program'
Output: 
$ npm start

User input: 'how to run a go program'
$ go run main.go

Each command should start with '$ '
If multiple commands are present they should start with a new line.`,
				},
				{
					role: 'user',
					content: msg,
				},
			],
		});

		return new Response(stream, {
			headers: { 'content-type': 'text/event-stream' },
		});
	},
} satisfies ExportedHandler<Env>;
