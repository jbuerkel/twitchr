/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as express from 'express';

import { getClient, putClient }                        from '../plugin/ircStore';
import { getPlugins, Plugin }                          from '../plugin/pluginManager';
import { IrcClient }                                   from '../plugin/ircClient';
import { rejectUnauthenticated, requireAuthenticated } from '../util/auth';

const router: express.Router = express.Router();

router.get('/', requireAuthenticated, (req: express.Request, res: express.Response) => {
    const name: string = req.user.name;
    const token: string = req.user.access_token;

    putClient(name, token);

    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
});

router.get('/plugins', rejectUnauthenticated, (req: express.Request, res: express.Response) => {
    const plugins: Array<Object> = [];

    getPlugins().forEach((plugin: Plugin) => {
        const meta: any = plugin.getMeta();
        const url: string = meta.homepage.replace('#readme', '');

        plugins.push({
            name: meta.name,
            version: meta.version,
            description: meta.description,
            url: url,
        });
    });

    res.json({ plugins: plugins });
});

router.get('/state', rejectUnauthenticated, (req: express.Request, res: express.Response) => {
    const name: string = req.user.name;
    const client: IrcClient = getClient(name);

    res.json({ isRunning: client && client.getIsRunning() || false });
});

router.post('/state', rejectUnauthenticated, (req: express.Request, res: express.Response) => {
    const name: string = req.user.name;
    const token: string = req.user.access_token;
    const client: IrcClient = putClient(name, token);

    if (client.getIsRunning()) {
        client.stop(() => res.json({ isRunning: client.getIsRunning() }));
    } else {
        client.start(() => res.json({ isRunning: client.getIsRunning() }));
    }
});

router.get('/user', rejectUnauthenticated, (req: express.Request, res: express.Response) => {
    res.json({ name: req.user.name });
});

export default router;
