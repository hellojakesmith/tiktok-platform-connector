import * as dotenv from 'dotenv';
dotenv.config();

/// MYSQL CREDENTIALS
export const MYSQL_USERNAME: string = process.env.MYSQL_USERNAME as string;
export const MYSQL_PASSWORD: string = process.env.MYSQL_PASSWORD as string;
export const MYSQL_HOST: string = process.env.MYSQL_HOST as string;
export const MYSQL_DATABASE: string = process.env.MYSQL_DATABASE as string;

/// TIKTOK SHOP CREDENTIALS
export const TIKTOK_APP_KEY: string = process.env.TIKTOK_APP_KEY as string;
export const TIK_TOK_APP_SECRET: string = process.env.TIK_TOK_APP_SECRET as string;
export const TIK_TOK_SELLER_ID: string = process.env.TIK_TOK_SELLER_ID as string;