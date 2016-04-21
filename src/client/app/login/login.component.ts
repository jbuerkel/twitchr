/*!
    twitchr - A twitch bot providing IRC based assistance
    Copyright (C) 2016  Jonas Bürkel

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import {Component, OnInit} from 'angular2/core';
import {ConfigService} from '../shared/config.service';

@Component({
    selector: 'twitchr-login',
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    public repositoryUrl: string;

    public constructor(private _configService: ConfigService) { }

    public launchBot(): void {
        // do stuff
    }

    public ngOnInit(): void {
        this.repositoryUrl = this._configService.getValue('repositoryUrl');
    }
}
