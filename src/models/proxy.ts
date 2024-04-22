import { DataTypes, Sequelize } from 'sequelize';

export interface ProxyInterface {
    proxy: string;
    port: string;
    code?: string;
    country?: string;
    city?: string;
    anonymity?: string;
    google?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    https?: string;
    lastChecked?: string;
    resource: string;
    internalCheckDate?: string;
    speed?: string;
}

// Define the Sequelize model for the Proxy interface
export const ProxyModel = (sequelize: Sequelize) => {
    return sequelize.define('ProxyModel', {
        proxy: DataTypes.STRING,
        port: DataTypes.STRING,
        code: DataTypes.STRING,
        country: DataTypes.STRING,
        city: DataTypes.STRING,
        anonymity: DataTypes.STRING,
        google: DataTypes.STRING,
        instagram: DataTypes.STRING,
        tiktok: DataTypes.STRING,
        facebook: DataTypes.STRING,
        https: DataTypes.STRING,
        lastChecked: DataTypes.STRING,
        resource: DataTypes.STRING,
        internalCheckDate: DataTypes.STRING,
        speed: DataTypes.STRING,
    },{
        tableName: 'parsed_proxies',
        indexes: [
            {
                unique: true,
                fields: ['proxy', 'port']
            }
        ]
    });
};