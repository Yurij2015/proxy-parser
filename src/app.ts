import {freeProxyListNet} from './parsers/free-proxy-list.net';
import {hidemyIo} from './parsers/hidemy.io';

async function main() {
    try {
        // freeProxyListNet('https://free-proxy-list.net/').then(r => console.log('Scraping free-proxy-list.net complete!'));
        hidemyIo('https://hidemy.io/en/proxy-list').then(r => console.log('Scraping hidymy.io complete!'));
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main().then(r => console.log('Script started!'));