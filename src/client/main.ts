/*!
    twitchr - A twitch bot providing IRC based assistance
    Copyright (C) 2016  Jonas Bürkel

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/// <reference path="../../node_modules/angular2/typings/browser.d.ts" />

import {AppComponent} from './app/app.component';
import {bootstrap} from 'angular2/platform/browser';
import {enableProdMode} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import 'rxjs/Rx';

// enableProdMode();

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
]);
