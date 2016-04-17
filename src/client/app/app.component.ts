/*!
    twitchr - A twitch bot providing IRC based assistance
    Copyright (C) 2016  Jonas Bürkel

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import {Component} from 'angular2/core';
import {HomeComponent} from '../home/home.component';
import {LoginComponent} from '../login/login.component';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

@Component({
    selector: 'twitchr-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS]
})
@RouteConfig([
    {
        path: '/',
        name: 'Home',
        component: HomeComponent
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent
    }
])
export class AppComponent { }
