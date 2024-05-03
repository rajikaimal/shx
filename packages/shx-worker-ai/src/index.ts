export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "AI" with the variable name you defined.
	AI: any;
}

type Message = {
	message: string;
};

export default {
	async fetch(request, env): Promise<Response> {
		let charsReceived = 0;

		const req = (await request.json()) as Message;
		const msg = req.message;

		console.log('MSG', msg);

		const stream = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
			stream: true,
			max_tokens: 512,
			messages: [
				{
					role: 'system',
					content: `You're 'shx', a command line assisant tool which can help to quickly provide commands based on the prompt asked by the user using a few liners. Don't provide code or markdown. Should be less verbose and on-point.
Examples:

User input: 
'how to run a node program'
Output: 
$ npm start

User input: 'how to run a go program'
$ go run main.go

Ouptut commands should start with '$'`,
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
