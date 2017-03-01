/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'twitchr-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: [ './sidenav.component.css' ],
})
export class SidenavComponent implements OnInit {
    isRunning: boolean;

    ngOnInit(): void {
        this.isRunning = true;
    }
}
