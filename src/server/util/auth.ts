/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as express from 'express';

/**
 * Middleware to reject authenticated requests for a corresponding route.
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function rejectAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.isUnauthenticated()) {
        next();
    } else {
        res.redirect('/api/irc');
    }
}

/**
 * Middleware to require authenticated requests for a corresponding route.
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
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
