/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import './rxjs-extensions';

import { ApiIrcService, SidenavComponent, ToolbarComponent } from './shared/index';
import { AppComponent }                                      from './app.component';
import { DashboardComponent }                                from './dashboard/index';
import { LoginComponent }                                    from './login/index';
import { SettingsComponent }                                 from './settings/index';
import { routing }                                           from './app.routing';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        routing,
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        LoginComponent,
        SettingsComponent,
        SidenavComponent,
        ToolbarComponent,
    ],
    providers: [
        ApiIrcService,
    ],
    bootstrap: [ AppComponent ],
})
export class AppModule { }
