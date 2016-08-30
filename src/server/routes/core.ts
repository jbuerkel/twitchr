/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as express from 'express';
import {deleteClient} from '../plugin/ircStore';
import {rejectAuthenticated, requireAuthenticated} from '../util/auth';
import {resolve} from 'app-root-path';

const router: express.Router = express.Router();

router.get('/login', rejectAuthenticated, (req: express.Request, res: express.Response) => {
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
