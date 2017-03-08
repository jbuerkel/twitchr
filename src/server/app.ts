/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as compression from 'compression';
import * as express     from 'express';
import * as favicon     from 'serve-favicon';
import * as helmet      from 'helmet';
import * as mongo       from 'connect-mongo';
import * as morgan      from 'morgan';
import * as passport    from 'passport';
import * as session     from 'express-session';
import { Strategy }     from 'passport-twitch';
import { resolve }      from 'app-root-path';

import auth from './routes/auth';
import core from './routes/core';
import irc  from './routes/irc';

const app: express.Express = express();
const MongoStore: mongo.MongoStoreFactory = mongo(session);

app.use(compression());
app.use(helmet());
app.use(favicon(resolve('./dist/client/assets/favicon.ico')));
if (app.get('env') !== 'production') {
    app.use(morgan('dev'));
}
app.use(express.static(resolve('./dist/client'), { index: false }));
app.use(session({
    cookie: { secure: process.env.USE_TLS === 'true' },
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
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
    const user: any = profile._json;

    user.provider = profile.provider;
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    user.scope = req.query.scope.split(' ');

    done(null, user);
}));

passport.serializeUser((user: any, done: Function) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: Function) => {
    done(null, user);
});

app.use('/api/irc', irc);
app.use('/api/oauth2', auth);

app.use(core);

export default app;
