import {Page} from "puppeteer";

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomDelay() {
    return Math.floor(Math.random() * 2000) + 1000;
}

export async function simulateRandomMouseMovements(page: Page) {
    const maxMovements = 10;
    for (let i = 0; i < maxMovements; i++) {
        const x = Math.floor(Math.random() * 1000);
        const y = Math.floor(Math.random() * 1000);

        await page.mouse.move(x, y);
        await wait(randomDelay());
    }
}

export async function simulateRandomDownScrolling(page: Page) {
    const maxScrolls = 5;
    for (let i = 0; i < maxScrolls; i++) {
        await page.evaluate(() => {
            const distance = Math.floor(Math.random() * 500) + 100;
            window.scrollBy(0, distance);
        });
        await wait(randomDelay());
    }
}

export function randomTypingDelay() {
    return Math.floor(Math.random() * 51) + 50;
}