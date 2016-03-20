'use strict';

import * as connectMongo from 'connect-mongo';
import * as dotenvSafe from 'dotenv-safe';
import * as express from 'express';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import * as session from 'express-session';
import {resolve} from 'app-root-path';

import core from './core/router';
import irc from './irc/router';
import oauth from './oauth/router';

dotenvSafe.load({
    path: resolve('./.env'),
    sample: resolve('./.env.example')
});

let app = express();
let mongoStore = connectMongo(session);

app.use(helmet());
app.use(logger('dev'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new mongoStore({
        touchAfter: 24 * 3600,
        url: process.env.MONGODB_URL
    })
}));
app.use(express.static(resolve('./dist/client')));

app.use('/api/irc', irc);
app.use('/api/oauth2', oauth);

app.use(core);

export default app;
