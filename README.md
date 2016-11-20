# twitchr
[![dependencies](https://img.shields.io/david/twitchr/twitchr.svg)](https://david-dm.org/twitchr/twitchr#info=dependencies&view=table)
[![devDependencies](https://img.shields.io/david/dev/twitchr/twitchr.svg)](https://david-dm.org/twitchr/twitchr#info=devDependencies&view=table)
[![license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://opensource.org/licenses/GPL-3.0)

This project provides a plugin-based IRC bot for [Twitch](https://www.twitch.tv/).
It is currently still at a very early stage. Expect more progress soon.

## Getting Started

The recommended way to deploy *twitchr* is by using [Docker](https://www.docker.com/).
After cloning or downloading the sources from this repository you have to add some configuration:

```sh
cp .env.example .env
```

The following environment variables *must* be specified inside the `.env` file:

- `CALLBACK_URL`: The callback URL specified while registering *twitchr* in your Twitch account settings, must point to the `/api/oauth2/callback` endpoint
- `CLIENT_ID`: The client ID received from Twitch after registering *twitchr*
- `CLIENT_SECRET`: The client secret received from Twitch after registering *twitchr*
- `SESSION_SECRET`: A random string used to sign the session ID cookies

The following environment variables are optional:

- `USE_TLS`: Determines if *twitchr* runs over HTTPS, if set to true a folder `cert/` must exist containing a `key.pem` and `cert.pem` file, default is false

After adding the plugins you would like to offer to your users (`package.json`) launch *twitchr*:

```sh
docker-compose -f docker-compose.prod.yml up
```

To run *twitchr* in development mode simply use:

```sh
docker-compose up
```

## Plugins

All plugins will be available as npm packages so you can easily build your own custom set of functionalities:

```sh
npm install --save twitchr-plugin-name
```

The [example plugin](https://github.com/twitchr/twitchr-example) is installed by default. Several additional plugins will be added soon.
For further information about the plugin system please see [twitchr-plugin-api](https://github.com/twitchr/twitchr-plugin-api).

## License

This project is licensed under the terms of the [GPLv3 license](https://github.com/twitchr/twitchr/blob/master/COPYING).
