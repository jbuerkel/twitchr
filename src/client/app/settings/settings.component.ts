/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';
import { ApiIrcService }     from '../shared/api/api-irc.service';

@Component({
    selector: 'twitchr-settings',
    templateUrl: './settings.component.html',
    styleUrls: [ './settings.component.css' ],
})
export class SettingsComponent implements OnInit {
    plugins: Array<Object>;

    constructor(private apiIrcService: ApiIrcService) { }

    ngOnInit(): void {
        this.apiIrcService.getPlugins()
            .then((plugins: Array<Object>) => this.plugins = plugins);
    }
}
