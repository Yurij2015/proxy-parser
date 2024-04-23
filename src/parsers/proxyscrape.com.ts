import axios from "axios";
import {ProxyInterface} from "../models/proxy";
import {saveProxyData} from "../helpers";

export async function proxyScrapeCom(url: string): Promise<void> {
    const result = await axios.get(url);
    let proxies = result.data.proxies;

    const proxyData: ProxyInterface[] = proxies.map(((item: {
        ip: string;
        port: string;
        ip_data: {
            countryCode: string;
            country: string;
            city: string;
            mobile: boolean;
            hosting: boolean;
            status: string;
        };
        anonymity: string;
        ssl: boolean;
        last_seen: number;
        uptime: string;
        protocol: string;
    }) => ({
        proxy: item.ip,
        port: item.port.toString(),
        code: item.ip_data?.countryCode,
        country: item.ip_data?.country,
        city: item.ip_data?.city,
        anonymity: item?.anonymity,
        https: item.ssl ? 'https' : 'http',
        lastChecked: new Date(item.last_seen * 1000).toISOString(),
        resource: url,
        speed: item.uptime,
        mobile: item.ip_data?.mobile,
        hosting: item.ip_data?.hosting,
        status: item.ip_data?.status,
        ssl: item?.ssl,
        protocol: item?.protocol
    })));

    try {
        await saveProxyData(proxyData);
    } catch (error) {
        console.error('Error saving data:', error);
    }

    console.log(proxyData);

}