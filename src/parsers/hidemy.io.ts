import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import {Proxy} from '../models/proxy';
import {Page} from 'puppeteer';

export async function hidemyIo(url: string): Promise<void> {
    // TODO Bypass Cloudflare, maybe with chrome extension
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
        // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        // headless: false,
        userDataDir: 'userDataDir/' + url.replace(/^https?:\/\//, ''),
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
    await page.setViewport(viewPort);
    // await page.setJavaScriptEnabled(true);

    // Go to the URL
    await page.goto(url, {waitUntil: 'networkidle2'});

    // await wait(randomDelay());

    const lastPageNumber = await page.$eval(
        '.pagination ul > li:nth-last-child(2) > a',
        el => el.textContent
    );

    const proxyData: Proxy[] = await page.evaluate(async (url: string) => {
        let trSelector = '.table_block > table > tbody > tr';
        return Array.from(document.querySelectorAll(trSelector), row => {
            const tds = row.querySelectorAll('td');
            const [
                ipAddress,
                port,
                country,
                speed,
                type,
                anonymity,
                lastUpdate,
            ] = Array.from(tds).map(td => td.textContent!.trim());

            return {
                proxy: ipAddress,
                port: port,
                code: country,
                country: country,
                anonymity: anonymity,
                https: type,
                lastChecked: lastUpdate,
                resource: url,
                speed: speed
            };
        });
    }, url);

    // await simulateRandomMouseMovements(page);
    //
    // await wait(randomDelay());
    //
    // await simulateRandomMouseMovements(page);

    const allowAll = await page.$('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    await wait(randomDelay());
    if (allowAll) {
        await allowAll.click();
    }

    // await wait(randomDelay());
    //
    // await simulateRandomDownScrolling(page);

    await wait(randomDelay());

    const nextButton = await page.$('.pagination > ul > li.next_array');
    if (nextButton) {
        console.log('Next button found');
        await wait(randomDelay());
        await nextButton.scrollIntoView();
        console.log('Scrolled to the next button element');
        await wait(randomDelay());
        // await nextButton.click().then(() => console.log('Next button clicked'));
    }

    // await simulateRandomDownScrolling(page);

    function wait(ms: number | undefined) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function randomDelay() {
        return Math.floor(Math.random() * 4000) + 1000;
    }

    function randomTypingDelay() {
        return Math.floor(Math.random() * 51) + 50;
    }


    async function simulateRandomMouseMovements(page: Page) {
        const maxMovements = 10;
        for (let i = 0; i < maxMovements; i++) {
            // Generate random coordinates for mouse movement
            const x = Math.floor(Math.random() * 1000); // Adjust max x coordinate as needed
            const y = Math.floor(Math.random() * 1000); // Adjust max y coordinate as needed

            await page.mouse.move(x, y);

            await wait(randomDelay());
        }
    }

    async function simulateRandomDownScrolling(page: Page) {
        const maxScrolls = 5;
        for (let i = 0; i < maxScrolls; i++) {
            // Scroll down by a random amount
            await page.evaluate(() => {
                const distance = Math.floor(Math.random() * 500) + 100; // Adjust max scroll distance as needed
                window.scrollBy(0, distance);
            });
            await wait(randomDelay()); // Adjust max delay as needed
        }
    }

    console.log(proxyData);
    console.log(lastPageNumber);

    await browser.close();
}
