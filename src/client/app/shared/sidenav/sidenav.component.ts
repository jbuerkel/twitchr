/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';
import { ApiIrcService }     from '../api/api-irc.service';

@Component({
    selector: 'twitchr-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: [ './sidenav.component.css' ],
})
export class SidenavComponent implements OnInit {
    isRunning: boolean;
    isStateChangePending: boolean;
    name: string;

    constructor(private apiIrcService: ApiIrcService) { }

    ngOnInit(): void {
        this.apiIrcService.getState()
            .then((isRunning: boolean) => this.isRunning = isRunning);

        this.apiIrcService.getUser()
            .then((name: string) => this.name = name);
    }

    toggleState(): void {
        if (!this.isStateChangePending) {
            this.isStateChangePending = true;

            this.apiIrcService.toggleState()
                .then((isRunning: boolean) => {
                    this.isRunning = isRunning;
                    this.isStateChangePending = false;
                });
        }
    }
}
