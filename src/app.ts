import {freeProxyListNet} from './parsers/free-proxy-list.net';
import {hidemyIo} from './parsers/hidemy.io';
import {freeProxyWorld} from './parsers/freeproxy.world';
import chalk from 'chalk';
import {proxyScrapeCom} from "./parsers/proxyscrape.com";
import {proxylistGeonodeCom} from "./parsers/proxylist.geonode.com";

async function main() {
    try {
        let proxyScrapeComUrl = "https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&proxy_format=protocolipport&format=json";
        freeProxyListNet('https://free-proxy-list.net/').then(r => console.log(chalk.red.bold('Scraping free-proxy-list.net complete!')));
        hidemyIo('https://hidemy.io/en/proxy-list').then(r => console.log('Scraping hidymy.io complete!'));
        freeProxyWorld('https://www.freeproxy.world').then(r => console.log('Scraping freeproxy.world complete!'));
        proxyScrapeCom(proxyScrapeComUrl).then(r => console.log(chalk.red.bold('Scraping proxyscrape.com complete!')));
        proxylistGeonodeCom('https://proxylist.geonode.com').then(r => console.log(chalk.red.bold('Scraping proxylist.geonode.com complete!')));
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
main().then(r => console.log('Script started!'));