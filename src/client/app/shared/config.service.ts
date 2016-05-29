/*!
    twitchr - A twitch bot providing IRC based assistance
    Copyright (C) 2016  Jonas Bürkel

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import {Injectable} from 'angular2/core';

interface Config {
    repositoryUrl: string;
    [key: string]: string;
}

@Injectable()
export class ConfigService {
    private _config: Config = {
        repositoryUrl: 'https://github.com/twitchr/twitchr',
    };

    public getValue(key: string): string {
        return this._config[key];
    }
}
