/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as express from 'express';

const router: express.Router = express.Router();

router.get('/stage', (req: express.Request, res: express.Response) => {
    res.json({ stage: process.env.NODE_ENV || 'development' });
});

export default router;
