import axios from 'axios';
import * as bodyParser from 'body-parser';
import dotenv = require('dotenv');
import * as express from 'express';

import { Zelem } from './apps/zelem';
import loadPython from './loaders/load-python';

const MINUTE = 60 * 1000;

dotenv.config();
main();

function main() {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.send('Sup');
  });

  const zel = new Zelem();

  loadPython('./src/apps/python_test/index.py');

  (async () => {
    await zel.start(app);
    console.log('Connected');
  })();

  app.listen(process.env.PORT || 3000);

  keepAlive();
}

function keepAlive() {
  setInterval(async () => {
    await axios.get('https://gami-apps.herokuapp.com');
  }, 25 * MINUTE);
}
