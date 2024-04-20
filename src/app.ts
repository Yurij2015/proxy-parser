import {freeProxyListNet} from './parsers/free-proxy-list.net';

async function main() {
    try {
        freeProxyListNet('https://free-proxy-list.net/').then(r => console.log('Scraping complete!'));
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main().then(r => console.log('Script complete!'));