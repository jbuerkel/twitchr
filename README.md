# twitchr
[![dependencies](https://img.shields.io/david/twitchr/twitchr.svg)](https://david-dm.org/twitchr/twitchr#info=dependencies&view=table)
[![devDependencies](https://img.shields.io/david/dev/twitchr/twitchr.svg)](https://david-dm.org/twitchr/twitchr#info=devDependencies&view=table)
[![license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://opensource.org/licenses/GPL-3.0)

This project provides a plugin-based IRC bot for [Twitch](https://www.twitch.tv/).
It is currently still at a very early stage. Expect more progress soon.

## Getting Started

As prerequisites you should have [Node.js](https://nodejs.org/en/) installed and an instance of [MongoDB](https://www.mongodb.com/) up and running.
Then clone and install this repository:

```sh
git clone https://github.com/twitchr/twitchr.git && cd twitchr/ && npm install
```

You should also provide a `.env` file in the project's root directory specifying the environment variables defined in `.env.example` ([explanation](https://www.npmjs.com/package/dotenv-safe)).
To obtain a `CLIENT_ID` and `CLIENT_SECRET` register this application for your Twitch account [here](https://www.twitch.tv/kraken/oauth2/clients/new).
The `CALLBACK_URL` should point to the `/api/oauth2/callback` endpoint.

After adding the plugins you would like to use launch your IRC bot:

```sh
npm start
```

## Plugins

All plugins will be available as npm packages so you can easily build your own custom set of functionalities:

```sh
npm install --save twitchr-plugin-name
```

The [example plugin](https://github.com/twitchr/twitchr-example) is installed by default. Several additional plugins will be added *after* the release of version `0.0.5`.
For further information about the plugin system please see [twitchr-plugin-api](https://github.com/twitchr/twitchr-plugin-api).

## License

This project is licensed under the terms of the [GPLv3 license](https://github.com/twitchr/twitchr/blob/master/COPYING).
