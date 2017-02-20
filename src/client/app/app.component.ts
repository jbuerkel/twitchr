/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit }            from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'twitchr-app',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    isAuthenticated: boolean;

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.router.events
            .filter((event: Event) => event instanceof NavigationEnd)
            .subscribe((event: NavigationEnd) => this.isAuthenticated = event.urlAfterRedirects !== '/login');
    }
}
