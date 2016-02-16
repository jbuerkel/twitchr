'use strict';

import * as express from 'express';
import {join} from 'path';
import * as logger from 'morgan';

import core from './core/router';

let app = express();

app.use(logger('dev'));
app.use(express.static(join(__dirname, '../build'))); // TODO

app.use(core);

export default app;
