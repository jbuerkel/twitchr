/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component } from '@angular/core';

@Component({
    selector: 'twitchr-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.css' ],
})
export class LoginComponent {
    launch(): void {
        window.location.href = '/api/oauth2';
    }
}
