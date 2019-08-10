import { Zelem } from './zelem';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import axios from 'axios';

const MINUTE = 60 * 1000;

main();

function main() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));

    const zel = new Zelem();

    (async () => {
        await zel.start();
        console.log('Connected');
    })();
    
    app.get('/', function (req, res) {
        res.send('Sup');
    });

    app.post('/zelem/goodbye', function (req, res) {
        zel.tryGoodbye(req.body['user_id']);

        res.send();
    });

    app.post('/zelem', function (req, res) {
        const question = req.body.text;

        if (
            typeof question === 'undefined' ||
            (question as string).trim().length < 1
        ) {
            return;
        }

        zel.tryAsk(question);

        res.send();
    });
    
    app.listen(process.env.PORT || 3000);

    keepAlive();
}

function keepAlive() {
    setInterval(async () => {
        await axios.get('https://gami-apps.herokuapp.com');
    },  25 * MINUTE);
}