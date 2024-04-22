import puppeteer from 'puppeteer';
import {ProxyInterface} from '../models/proxy';
import {randomDelay, saveProxyData, simulateRandomDownScrolling, simulateRandomMouseMovements, wait} from '../helpers';
import chalk from "chalk";
export async function freeProxyListNet(url: string): Promise<void> {
    const browser = await puppeteer.launch({
        // headless: false,
        userDataDir: 'userDataDir/' + url.replace(/^https?:\/\//, '')
    });
    const viewPort = {
        width: 1280 + Math.floor(Math.random() * 100),
        height: 720 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false
    };

    const page = await browser.newPage();
    await page.setViewport(viewPort);

    // Go to the URL
    await page.goto(url, {waitUntil: 'networkidle2'});
    await simulateRandomMouseMovements(page);
    await wait(randomDelay());
    await simulateRandomDownScrolling(page);

    const proxyData: ProxyInterface[] = await page.evaluate((url: string) => {
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
                https,
                lastChecked,
            ] = Array.from(tds).map(td => td.textContent!.trim());

            return {
                proxy: proxy,
                port: port,
                code: code,
                country: country,
                anonymity: anonymity,
                google: google,
                https: https,
                lastChecked: lastChecked,
                resource: url,
            };
        });
    }, url);

    try {
        await saveProxyData(proxyData);
    } catch (error) {
        console.error('Error saving data:', error);
    }
    await browser.close();
    console.log(url + chalk.green.bold(' browser closed'));
}
