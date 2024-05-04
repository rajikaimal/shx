# shx

🏭 Command with ease

https://github.com/rajikaimal/shx/assets/8940086/d8f5bdee-d8df-4ab5-86f4-f5f04e69fd53

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
