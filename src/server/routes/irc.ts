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

import * as express from 'express';
import {initialize} from '../plugin/init';
import {requireAuthenticated} from '../util/auth';

let router: express.Router = express.Router();

router.get('/', requireAuthenticated, (req: express.Request, res: express.Response) => {
    let username: string = req.user.name.toLowerCase();
    let password: string = req.user.access_token;

    // todo: store client in session
    initialize(username, password);

    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
});

export default router;
