/**
 * @license
 * Copyright (C) 2017  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { enableProdMode, PlatformRef } from '@angular/core';
import { platformBrowserDynamic }      from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

const xhr = new XMLHttpRequest();
const platform: PlatformRef = platformBrowserDynamic();

xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (JSON.parse(xhr.responseText).stage === 'production') {
            enableProdMode();
        }

        platform.bootstrapModule(AppModule);
    }
};

xhr.open('GET', '/api/stage', true);
xhr.send();
