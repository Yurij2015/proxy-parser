import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import {Proxy} from '../models/proxy';
import {Page} from 'puppeteer';
import {randomDelay, simulateRandomDownScrolling, simulateRandomMouseMovements, wait} from '../helpers';

export async function freeProxyWorld(url: string): Promise<void> {
    puppeteerExtra.use(StealthPlugin());

    const viewPort = {
        width: 1280 + Math.floor(Math.random() * 100),
        height: 720 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false
    };
    const browser = await puppeteerExtra.launch({
        headless: false,
        userDataDir: 'userDataDir/' + url.replace(/^https?:\/\//, ''),
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
    await page.setViewport(viewPort);

    await page.goto(url, {waitUntil: 'networkidle2'});

    const lastPageNumber = await page.$eval(
        'a.layui-laypage-last',
        el => el.getAttribute('data-page')
    );

    for (let i = 1; i <= parseInt(lastPageNumber ?? '1'); i++) {
        let pageParam =`/?page=${i}`;
        console.log(`Page ${i} of ${lastPageNumber}`);
        console.log(url + pageParam);
        await page.goto(url + pageParam, {waitUntil: 'networkidle2'});
        await openPage(page, url + pageParam);
        console.log(`Page ${i} of ${lastPageNumber}`);
    }

    async function openPage(page: Page, url: string) {

        const proxyData: Proxy[] = await page.evaluate(async (url: string) => {
            let trSelector = '.proxy-table > table > tbody > tr';
            const rowData = {} as Proxy;
            return Array.from(document.querySelectorAll(trSelector), row => {
                const tds = row.querySelectorAll('td');
                const [
                    ipAddress,
                    port,
                    country,
                    city,
                    speed,
                    type,
                    anonymity,
                    lastCheck,
                ] = Array.from(tds).map(td => td.textContent!.trim());

                Object.assign(rowData, {
                    proxy: ipAddress,
                    port: port,
                    code: country,
                    country: country,
                    city: city,
                    anonymity: anonymity,
                    https: type,
                    lastChecked: lastCheck,
                    resource: url,
                    speed: speed
                })
                return rowData;
            });
        }, url);

        console.log(proxyData);

        await simulateRandomMouseMovements(page);
        await wait(randomDelay());

        const allowAll = await page.$('.fc-cta-consent.fc-primary-button');
        await wait(randomDelay());
        if (allowAll) {
            await allowAll.click();
        }

        await simulateRandomDownScrolling(page);

        const nextButton = await page.$('.layui-laypage-next');
        if (nextButton) {
            await wait(randomDelay());
            await nextButton.scrollIntoView();
            await wait(randomDelay());
            // await nextButton.click().then(() => console.log('Next button clicked'));
        }
        await wait(randomDelay());
    }

    console.log(lastPageNumber);

    // await browser.close();
}
