# shx

Command with ease

## Worker AI

- You need a [Cloudflare account](https://www.cloudflare.com/) to setup a Worker AI
- Use [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) to setup the secrets. (or use Cloudflare dashboard)
- Setup `user` and `pwd` secrets to setup Worker AI authentication.
  - `$ wrangler secret put user`
  - `$ wrangler secret put pwd`

## shx CLI

### Install

```
$ npm i -g @rajikaimal/shx
```

### Usage

```
$ shx --url=<worker_ai_uri> --authToken=<user:pwd>
```

This will create a encoded auth token at `$HOME/.shrxc`

```
$ shx "how to remove all docker containers"
```

MIT
