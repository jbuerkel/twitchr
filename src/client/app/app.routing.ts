/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/index';
import { LoginComponent }     from './login/index';
import { SettingsComponent }  from './settings/index';

const appRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
    },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
