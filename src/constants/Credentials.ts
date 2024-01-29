import * as dotenv from 'dotenv';
dotenv.config();

/// MONGO CREDENTIALS
export const MYSQL_USER: string = process.env.MYSQL_USERNAME as string;
export const MYSQL_PASSWORD: string = process.env.MYSQL_PASSWORD as string;
export const MYSQL_HOST: string = process.env.MYSQL_HOST as string;
export const MYSQL_DATABASE: string = process.env.MYSQL_DATABASE as string;

// BOLD PLUGIN PRODUCTION CREDENTIALS
export const PLUGIN_CLIENT_ID: string = process.env.PLUGIN_CLIENT_ID_PROD as string;
export const PLUGIN_CLIENT_SECRET: string =  process.env.PLUGIN_CLIENT_SECRET_PROD as string;

/*
 BOLD DEVELOPER V2 PRODUCTION CREDENTIALS
 Generate https://developer.boldcommerce.com/default/dashboard
*/
export const BOLD_DEVELOPER_CLIENT: string = process.env.BOLD_DEVELOPER_CLIENT_PROD as string;
export const BOLD_DEVELOPER_SECRET: string = process.env.BOLD_DEVELOPER_SECRET_PROD as string;

export const TIKTOK_APP_KEY: string = process.env.TIKTOK_APP_KEY as string;
export const TIK_TOK_APP_SECRET: string = process.env.TIK_TOK_APP_SECRET as string;
export const TIK_TOK_SELLER_ID: string = process.env.TIK_TOK_SELLER_ID as string;