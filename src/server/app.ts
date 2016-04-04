/*!
    twitchr - A twitch bot providing IRC based assistance
    Copyright (C) 2016  Jonas Bürkel
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

import * as connectMongo from 'connect-mongo';
import * as dotenvSafe from 'dotenv-safe';
import * as express from 'express';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import * as session from 'express-session';
import {resolve} from 'app-root-path';

import core from './routes/core';
import irc from './routes/irc';
import oauth from './routes/oauth';

dotenvSafe.load({
    path: resolve('./.env'),
    sample: resolve('./.env.example'),
});

let app: express.Express = express();
let mongoStore: connectMongo.MongoStoreFactory = connectMongo(session);

app.use(helmet());
app.use(logger('dev'));
app.use(session({
    cookie: {secure: true},
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new mongoStore({
        touchAfter: 24 * 3600,
        url: process.env.MONGODB_URL,
    }),
}));
app.use(express.static(resolve('./dist/client')));

app.use('/api/irc', irc);
app.use('/api/oauth2', oauth);

app.use(core);

export default app;
