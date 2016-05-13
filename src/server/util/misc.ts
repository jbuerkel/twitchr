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

/**
 * Middleware to reject authentication for a corresponding route.
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function rejectAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (!req.session.oauth) {
        next();
    } else {
        res.redirect('/api/irc');
    }
}

/**
 * Middleware to require authentication for a corresponding route.
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (!req.session.oauth) {
        if (req.originalUrl !== '/logout') {
            req.session.originalUrl = req.originalUrl;
        }
        res.redirect('/login');
    } else {
        next();
    }
}
