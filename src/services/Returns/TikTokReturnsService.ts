import axios from 'axios';
import { TIKTOK_APP_KEY, TIK_TOK_SHOP_OPEN_API_URL } from '../../constants';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens';
import AuthorizedShops from '../../database/Authorization/TikTokShopAuthorizedShops';

class TikTokReturnsService {
    private tikTokShopTokens: TikTokShopAccessTokens;
    private authorizedShops: AuthorizedShops;

    constructor() {
        this.tikTokShopTokens = new TikTokShopAccessTokens();
        this.authorizedShops = new AuthorizedShops();
    }

    public async approveReturn(shopId: string, returnId: string, requestBody: any) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/return_refund/202309/returns/${returnId}/approve`;

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: timestamp,
            shop_cipher: shop.cipher,
            ...requestBody,
        };

       
        const sign = TikTokGenerateSignature(path, params, JSON.stringify(requestBody));

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token 
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token, // Access token included in the header
                }
            });

            if (response.data.code !== 0) {
                throw new Error(`Error approving return: ${JSON.stringify(response.data)}`);
            }

            return response.data;
        } catch (error) {
            throw new Error(`Error approving return: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async rejectReturn(shopId: string, returnId: string, requestBody: any) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/return_refund/202309/returns/${returnId}/reject`; // Dynamic path with returnId
        
        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: timestamp,
            shop_cipher: shop.cipher,
            ...requestBody,
        };

       
        const sign = TikTokGenerateSignature(path, params, JSON.stringify(requestBody));

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token 
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                }
            });

            if (response.data.code !== 0) {
                console.log(response.data)
                throw new Error(`Error rejecting return: ${JSON.stringify(response.data)}`);
            }

            return response.data;
        } catch (error) {
            console.log
            throw new Error(`Error rejecting return: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getReturnRecords(shopId: string, returnId: string, locale: string = "en-US") {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/return_refund/202309/returns/${returnId}/records`;

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: timestamp,
            shop_cipher: shop.cipher, // Passed as a query parameter
            locale,
        };

        const sign = TikTokGenerateSignature(path, params);

        const queryParams = new URLSearchParams({
            app_key: TIKTOK_APP_KEY,
            sign: sign,
            timestamp: `${timestamp}`,
            access_token: tokens.access_token, 
            shop_cipher: shop.cipher,
            locale
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                }
            });

            if (response.data.code !== 0) {
                throw new Error(`Error getting return records: ${JSON.stringify(response.data)}`);
            }

            return response.data;
        } catch (error) {
            throw new Error(`Error getting return records: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async searchReturns(shopId: string, requestBody: any) {
        // Retrieve shop information and corresponding access token
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/return_refund/202309/returns/search';

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: timestamp,
            shop_cipher: shop.cipher,
            ...requestBody,
        };

       
        const sign = TikTokGenerateSignature(path, params, JSON.stringify(requestBody));

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token 
        }).toString();
        
        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        console.log({url})

        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token, // Ensure this is the correct way to pass token
                }
            });

            if (response.data.code !== 0) {
                throw new Error(`Error searching returns: ${JSON.stringify(response.data)}`);
            }

            return response.data;
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                throw new Error(`Error searching returns: ${error.message}`);
            } else {
                throw new Error('Error searching returns: Unknown error');
            }
        }
    }

    public async createReturn(shopId: string, requestBody: any) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);
    
        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/return_refund/202309/returns`;
    
        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: timestamp,
            shop_cipher: shop.cipher,
            ...requestBody,
        };

        const sign = TikTokGenerateSignature(path, params, JSON.stringify(requestBody));

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token 
        }).toString();
        
        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;
    
        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token, // Include the access token in the headers
                }
            });
    
            if (response.data.code !== 0) {
                throw new Error(`Error creating return: ${JSON.stringify(response.data)}`);
            }
    
            return response.data;
        } catch (error) {
            throw new Error(`Error creating return: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    
}

export default TikTokReturnsService;
