import { Zelem } from './zelem';


function main() {
    const zel = new Zelem();

    (async () => {
        await zel.start();
        console.log('Connected');
    })();
}

main();