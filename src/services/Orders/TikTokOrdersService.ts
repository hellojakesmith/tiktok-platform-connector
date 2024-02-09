import axios from 'axios';
import { TIKTOK_APP_KEY, TIK_TOK_SHOP_OPEN_API_URL } from '../../constants';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens';
import AuthorizedShops from '../../database/Authorization/TikTokShopAuthorizedShops';

class TikTokOrdersService {
    private tikTokShopTokens: TikTokShopAccessTokens;
    private authorizedShops: AuthorizedShops;

    constructor() {
        this.tikTokShopTokens = new TikTokShopAccessTokens();
        this.authorizedShops = new AuthorizedShops();
    }

    public async getOrderList(shopId: string, requestBody: any) {
        // Retrieve shop information and corresponding access token
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/order/202309/orders/search';

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: timestamp,
            shop_cipher: shop.cipher,
            ...requestBody,
        };

        // Generate the signature without the access token
        const sign = TikTokGenerateSignature(path, params, JSON.stringify(requestBody));

        // Construct the request URL with query parameters
        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token // Include access token in query
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;


        console.log('Request URL:', url);
        console.log('Request Headers:', {
            'Content-Type': 'application/json',
            'x-tts-access-token': tokens.access_token
        });
        console.log('Request Body:', JSON.stringify(requestBody));
        console.log('Generated Signature:', sign);


        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token
                }
            });

            if (response.data.code !== 0) {
                throw new Error(`Error fetching order list: ${JSON.stringify(response.data)}`);
            }

            return response.data;
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                throw new Error(`Error fetching order list: ${error.message || 'Unknown error'}`);
            } else {
                throw new Error(`Error fetching order list: 'Unknown error'}`);
            }
        }
    }
}

export default TikTokOrdersService;
