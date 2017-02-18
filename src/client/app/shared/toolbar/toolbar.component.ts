/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component }                    from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'twitchr-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: [ './toolbar.component.css' ],
})
export class ToolbarComponent {
    isAuthenticated: boolean;

    constructor(private router: Router) {
        this.router.events
            .filter((event: Event) => event instanceof NavigationEnd)
            .subscribe((event: NavigationEnd) => this.isAuthenticated = event.urlAfterRedirects !== '/login');
    }

    logout(): void {
        window.location.href = '/logout';
    }
}
