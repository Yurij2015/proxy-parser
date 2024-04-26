import sequelize from "../config/sequelize";
import {ProxyModel} from '../models/proxy';
import ProxyChecker from "nodejs-proxy-checkerv2";
import puppeteer from 'puppeteer';
import axios from 'axios';



// Example query to find all proxies
export const findAllProxies = async () => {
    const ProxyDataModel = ProxyModel(sequelize);
    try {
        const proxies = await ProxyDataModel.findAll({
            // limit: 1000, order: [['createdAt', 'DESC']]
        });
        const formattedProxies = proxies.map((proxy: any) => `${proxy.https}://${proxy.proxy}:${proxy.port}`);
        const myLinks = ['https://instagram.com/']

        const checkProxy = async (proxy: string): Promise<boolean> => {
            try {
                const response = await axios.get('https://www.instagram.com', {
                    proxy: {
                        host: proxy.split('://')[1].split(':')[0],
                        port: parseInt(proxy.split(':')[1]),
                    },
                    timeout: 100000, // Adjust timeout as needed
                });
                // If the request succeeds, consider the proxy as working
                console.log(`Proxy ${proxy} is working.`);
                return true;
            } catch (error) {
                // If the request fails, consider the proxy as not working
                console.error(`Proxy ${proxy} failed`);
                return false;
            }
        };

        const checkProxiesInParallel = async (proxies: string[]): Promise<string[]> => {
            const results = await Promise.all(proxies.map(checkProxy));
            const workingProxies = proxies.filter((_, index) => results[index]);
            console.log('Working proxies:', workingProxies);
            return workingProxies;
        };

        // const workingProxies: string[] = [];

        // for (const proxy of formattedProxies) {
        //     try {
        //         const browser = await puppeteer.launch({
        //             // headless: false,
        //             args: [`--proxy-server=${proxy}`],
        //         });
        //
        //         const page = await browser.newPage();
        //
        //         for (const site of myLinks) {
        //             await page.goto(site, { timeout: 30000 }); // Adjust timeout as needed
        //             // If page loads successfully with proxy, consider it a working proxy for the site
        //             workingProxies.push(proxy);
        //         }
        //
        //         await browser.close();
        //     } catch (error) {
        //         // If browser fails to launch or page fails to load with the proxy, consider it a non-working proxy
        //         console.error(`Proxy ${proxy} failed:`, error);
        //     }
        // }
        //
        // console.log('Working proxies:', workingProxies);


        // const instance = new ProxyChecker()
        //     .addProxiesFromArray(formattedProxies)
        //     .addProxyInformationProvider(myInformationProviderLinks)
        //     .addDefaultProxyJudge() // -&gt; optional if you put yours otherwise you have to put it
        // ; // -&gt; optional if you put yours otherwise you have to put it
        //
        // const result = await instance.check(null);
        //
        //
        // console.log('All proxies:', formattedProxies);
        await checkProxiesInParallel(formattedProxies);

        // return formattedProxies;
    } catch (error) {
        console.error('Error fetching proxies:', error);
        throw error;
    }
};

