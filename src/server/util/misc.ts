'use strict';

import * as express from 'express';

/**
 * Middleware to enforce authentication for a corresponding route.
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.session.oauth) {
        req.session.originalUrl = req.originalUrl;
        res.redirect('/login');
    } else {
        next();
    }
}
