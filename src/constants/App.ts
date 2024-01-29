import * as dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENT = process.env.ENVIRONMENT || 'staging';
export const PORT = process.env.PORT || 8000;
export const APP_URL = process.env.APP_URL
