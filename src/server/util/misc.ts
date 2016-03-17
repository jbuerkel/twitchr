'use strict';

import * as express from 'express';
import {join} from 'path';
import {readFileSync} from 'fs';

/**
 * Synchronously loads a JSON file specified by its absolute path.
 * @param {string} path
 * @returns {any}
 */
export function loadJson(path: string) {
    let file = readFileSync(path, 'utf8');
    return JSON.parse(file);
}

/**
 * Synchronously loads a JSON file relative to the project's root directory.
 * @param {string[]} paths
 * @returns {any}
 */
export function loadJsonRoot(...paths: string[]) {
    return loadJson(rootJoin(...paths));
}

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

/**
 * Joins a given set of paths relative to the project's root directory.
 * @param {string[]} paths
 * @returns {string}
 */
export function rootJoin(...paths: string[]) {
    let root = process.env.NODE_PATH || join(__dirname, '../../..');
    return join(root, ...paths);
}
