import {freeProxyListNet} from './parsers/free-proxy-list.net';
import {hidemyIo} from './parsers/hidemy.io';
import {freeProxyWorld} from './parsers/freeproxy.world';
import chalk from 'chalk';

async function main() {
    try {
        freeProxyListNet('https://free-proxy-list.net/').then(r => console.log(chalk.red.bold('Scraping free-proxy-list.net complete!')));
        // hidemyIo('https://hidemy.io/en/proxy-list').then(r => console.log('Scraping hidymy.io complete!'));
        // freeProxyWorld('https://www.freeproxy.world').then(r => console.log('Scraping freeproxy.world complete!'));
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
main().then(r => console.log('Script started!'));