/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, Input } from '@angular/core';

@Component({
    selector: 'twitchr-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: [ './toolbar.component.css' ],
})
export class ToolbarComponent {
    @Input()
    isAuthenticated: boolean;

    logout(): void {
        window.location.href = '/logout';
    }
}
