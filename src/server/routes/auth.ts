/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as express               from 'express';
import { authenticate }           from 'passport';
import { requireUnauthenticated } from '../util/auth';

const router: express.Router = express.Router();

router.get('/',
    requireUnauthenticated,
    authenticate('twitch'));

router.get('/callback',
    requireUnauthenticated,
    authenticate('twitch', {
        failureRedirect: '/login',
        successRedirect: '/api/irc',
    }));

export default router;
