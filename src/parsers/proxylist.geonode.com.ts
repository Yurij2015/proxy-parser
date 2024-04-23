import axios from "axios";
import {ProxyInterface} from "../models/proxy";
import {saveProxyData} from "../helpers";

export async function proxylistGeonodeCom(url: string): Promise<void> {

    let limit = 500;
    let countOfPages = 10;
    for (let page = 1; page <= countOfPages; page++) {
        let path = `/api/proxy-list?limit=${limit}&page=${page}`;
        const result = await axios.get(url + path);
        let proxies = result.data.data;
        const proxyData: ProxyInterface[] = proxies.map(((proxy: {
            ip: string;
            port: string;
            country: string;
            city: string;
            status: string;
            anonymityLevel: string;
            protocols: [];
            lastChecked: number;
            speed: string;
        }) => ({
            proxy: proxy.ip,
            port: proxy.port.toString(),
            code: proxy.country,
            country: proxy.country,
            city: proxy.city,
            anonymity: proxy.anonymityLevel,
            https: proxy.protocols.join(', ').toLowerCase(),
            lastChecked: new Date(proxy.lastChecked * 1000).toISOString(),
            resource: url + path,
            speed: proxy.speed,
        })));

        try {
            await saveProxyData(proxyData);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
}