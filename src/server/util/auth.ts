/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as express from 'express';

export function rejectUnauthenticated(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.sendStatus(401);
    }
}

export function requireAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.isAuthenticated()) {
        next();
    } else {
        if (req.path !== '/logout') {
            req.session.returnTo = req.originalUrl;
        }
        res.redirect('/login');
    }
}

export function requireUnauthenticated(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.isUnauthenticated()) {
        next();
    } else {
        res.redirect('/api/irc');
    }
}
