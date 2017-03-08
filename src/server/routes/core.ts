/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as express from 'express';
import { resolve }  from 'app-root-path';

import { deleteClient }                                 from '../plugin/ircStore';
import { requireAuthenticated, requireUnauthenticated } from '../util/auth';

const router: express.Router = express.Router();

router.get('/login', requireUnauthenticated, (req: express.Request, res: express.Response) => {
    res.sendFile(resolve('./dist/client/index.html'));
});

router.get('/logout', requireAuthenticated, (req: express.Request, res: express.Response) => {
    deleteClient(req.user.name);
    req.logout();
    res.redirect('/login');
});

router.get('/*', requireAuthenticated, (req: express.Request, res: express.Response) => {
    res.sendFile(resolve('./dist/client/index.html'));
});

export default router;
