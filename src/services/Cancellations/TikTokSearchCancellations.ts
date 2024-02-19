import axios from 'axios';
import { TIKTOK_APP_KEY, TIK_TOK_SHOP_OPEN_API_URL } from '../../constants';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens';
import AuthorizedShops from '../../database/Authorization/TikTokShopAuthorizedShops';

class TikTokCancellationsService {
    private tikTokShopTokens: TikTokShopAccessTokens;
    private authorizedShops: AuthorizedShops;

    constructor() {
        this.tikTokShopTokens = new TikTokShopAccessTokens();
        this.authorizedShops = new AuthorizedShops();
    }

    public async searchCancellations(shopId: string, requestBody: any) {
        // Retrieve shop information and corresponding access token
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/return_refund/202309/cancellations/search';

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: timestamp,
            shop_cipher: shop.cipher, // Ensure this is added as a query parameter
            // Do not include requestBody parameters in the signature generation
        };

        // Generate the signature without including requestBody in the signature calculation
        const sign = TikTokGenerateSignature(path, params);

        // Construct the request URL without requestBody parameters
        const queryParams = new URLSearchParams({
            app_key: TIKTOK_APP_KEY,
            sign: sign,
            timestamp: `${timestamp}`,
            access_token: tokens.access_token, // This is correct if your API expects it in the URL
            shop_cipher: shop.cipher,
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
                throw new Error(`Error searching cancellations: ${JSON.stringify(response.data)}`);
            }

            return response.data;
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                throw new Error(`Error searching cancellations: ${error.message || 'Unknown error'}`);
            } else {
                throw new Error(`Error searching cancellations: 'Unknown error'}`);
            }
        }
    }
}

export default TikTokCancellationsService;
