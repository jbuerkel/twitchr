'use strict';

import * as connectMongo from 'connect-mongo';
import * as dotenvSafe from 'dotenv-safe';
import * as express from 'express';
import * as logger from 'morgan';
import * as session from 'express-session';
import {loadJsonRoot, rootJoin} from './util/misc';

import core from './core/router';
import oauth from './oauth/router';

dotenvSafe.load({
    path: rootJoin('.env'),
    sample: rootJoin('.env.example')
});

let app = express();
let mongoStore = connectMongo(session);
let paths = loadJsonRoot('./paths.conf.json');

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
app.use(express.static(rootJoin(paths.dist.client)));

app.use('/api/oauth2', oauth);

app.use(core);

export default app;
