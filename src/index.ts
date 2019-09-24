import axios from 'axios';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { Zelem } from './zelem';

const MINUTE = 60 * 1000;

const foo;

require('dotenv').config();
main();

function main() {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', function(req, res) {
    res.send('Sup');
  });

  const zel = new Zelem();

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
