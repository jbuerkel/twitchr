/**
 * @license
 * Copyright (C) 2016  Jonas Bürkel
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class ApiIrcService {
    apiIrcBase: string = 'api/irc';

    constructor(private http: Http) { }

    toggleState(): Promise<boolean> {
        return this.http.post(`${this.apiIrcBase}/state`, null)
            .toPromise()
            .then((response: Response) => response.json().isRunning as boolean)
            .catch(this.handleError);
    }

    getState(): Promise<boolean> {
        return this.http.get(`${this.apiIrcBase}/state`)
            .toPromise()
            .then((response: Response) => response.json().isRunning as boolean)
            .catch(this.handleError);
    }

    getUser(): Promise<string> {
        return this.http.get(`${this.apiIrcBase}/user`)
            .toPromise()
            .then((response: Response) => response.json().name as string)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
