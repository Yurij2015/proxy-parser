import puppeteer from 'puppeteer';
import {Proxy} from '../models/proxy';

export async function freeProxyListNet(url: string): Promise<void> {
    const browser = await puppeteer.launch({
        // headless: false
    });
    const page = await browser.newPage();

    // Go to the URL
    await page.goto(url, {waitUntil: 'networkidle2'});

    const proxyData = await page.evaluate((): Proxy[] => {
        let trSelector = '#list > div > div.table-responsive > div > table > tbody > tr';
        return Array.from(document.querySelectorAll(trSelector), row => {
            const tds = row.querySelectorAll('td');
            const [
                proxy,
                port,
                code,
                country,
                anonymity,
                google,
                instagram,
                https,
                lastChecked
            ] = Array.from(tds).map(td => td.textContent!.trim());

            return {
                proxy: proxy || '',
                port: port || '',
                code: code || '',
                country: country || '',
                anonymity: anonymity || '',
                google: google || '',
                instagram: instagram || '',
                https: https || '',
                lastChecked: lastChecked || ''
            };
        });
    });

    console.log(proxyData);

    await browser.close();
}
