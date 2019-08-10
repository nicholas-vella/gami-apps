import { Zelem } from './zelem';


function main() {
    const express = require('express')
    const app = express();

    const zel = new Zelem();

    (async () => {
        await zel.start();
        console.log('Connected');
    })();
    
    app.get('/', function (req, res) {
        res.send('Sup');
    });
    
    app.listen(process.env.PORT || 3000);
}

main();