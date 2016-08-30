/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as express from 'express';
import {IrcClient} from '../plugin/ircClient';
import {putClient} from '../plugin/ircStore';
import {requireAuthenticated} from '../util/auth';

const router: express.Router = express.Router();

router.get('/', requireAuthenticated, (req: express.Request, res: express.Response) => {
    const name: string = req.user.name;
    const token: string = req.user.access_token;

    const client: IrcClient = new IrcClient(name, token);
    client.config().start(() => putClient(name, client));

    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
});

export default router;
