/*!
    twitchr - A twitch bot providing IRC based assistance
    Copyright (C) 2016  Jonas Bürkel

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import {Component} from 'angular2/core';
import {ConfigService} from './shared/config.service';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RestService} from './shared/rest.service';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    directives: [ROUTER_DIRECTIVES],
    providers: [ConfigService, RestService],
    selector: 'twitchr-app',
    templateUrl: './app.component.html',
})
@RouteConfig([
    {
        component: HomeComponent,
        name: 'Home',
        path: '/',
    },
    {
        component: LoginComponent,
        name: 'Login',
        path: '/login',
    },
])
export class AppComponent { }
