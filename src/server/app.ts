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

import * as connectMongo from 'connect-mongo';
import * as dotenvSafe from 'dotenv-safe';
import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import * as passport from 'passport';
import * as session from 'express-session';
import {Strategy} from 'passport-twitch';
import {resolve} from 'app-root-path';

import auth from './routes/auth';
import core from './routes/core';
import irc from './routes/irc';

dotenvSafe.load({
    path: resolve('./.env'),
    sample: resolve('./.env.example'),
});

let app: express.Express = express();
let mongoStore: connectMongo.MongoStoreFactory = connectMongo(session);

app.use(helmet());
app.use(favicon(resolve('./dist/client/assets/favicon.ico')));
app.use(logger('dev'));
app.use(express.static(resolve('./dist/client'), {index: false}));
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
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy({
    callbackURL: process.env.CALLBACK_URL,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    passReqToCallback: true,
    scope: 'chat_login user_read',
    state: true,
}, (req: express.Request, accessToken: string, refreshToken: string, profile: any, done: Function) => {
    let user: any = profile._json;

    user.provider = profile.provider;
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    user.scope = req.query.scope.split(' ');

    done(undefined, user);
}));

passport.serializeUser((user: any, done: Function) => {
    done(undefined, user);
});

passport.deserializeUser((user: any, done: Function) => {
    done(undefined, user);
});

app.use('/api/irc', irc);
app.use('/api/oauth2', auth);

app.use(core);

export default app;
