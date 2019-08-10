import { Zelem } from './zelem';
import * as express from 'express';
import * as bodyParser from 'body-parser';

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

    app.post('/zelem', function (req, res) {
        const question = req.body.text;
        console.log(question);

        if (
            typeof question === 'string' &&
            (question as string).trim().length > 0
        ) {
            zel.tryAsk(question);
        }

        res.send();
    });
    
    app.listen(process.env.PORT || 3000);
}

main();