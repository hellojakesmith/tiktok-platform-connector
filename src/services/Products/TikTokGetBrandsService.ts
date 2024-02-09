import axios from 'axios';
import { TIKTOK_APP_KEY, TIK_TOK_SHOP_OPEN_API_URL } from '../../constants';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens';
import AuthorizedShops from '../../database/Authorization/TikTokShopAuthorizedShops';

class TikTokBrandsService {
    private tikTokShopTokens: TikTokShopAccessTokens;
    private authorizedShops: AuthorizedShops;

    constructor() {
        this.tikTokShopTokens = new TikTokShopAccessTokens();
        this.authorizedShops = new AuthorizedShops();
    }

    public async getBrands(shopId: string, pageSize: number, pageToken?: string, categoryId?: string, isAuthorized?: boolean, brandName?: string) {
        // Retrieve the access token and shop cipher using the shopId
      
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/product/202309/brands';

        const params: any = {
            app_key: TIKTOK_APP_KEY,
            access_token: tokens.access_token,
            timestamp: timestamp,
            shop_cipher: shop.cipher, // Use the cipher from the authorized shop
            page_size: pageSize,
        };

        // Include optional parameters if provided
        if (pageToken) params.page_token = pageToken;
        if (categoryId) params.category_id = categoryId;
        if (isAuthorized !== undefined) params.is_authorized = isAuthorized;
        if (brandName) params.brand_name = brandName;

        const sign = TikTokGenerateSignature(path, params);
        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token
                },
                params: {
                    ...params,
                    sign: sign
                }
            });

            if (response.data.code !== 0) {
                throw new Error(`Error fetching brands: ${JSON.stringify(response.data)}`);
            }

            return response.data;
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                throw new Error(`Error fetching brands: ${error.message || 'Unknown error'}`);
            } else {
                throw new Error(`Error fetching brands: 'Unknown error'}`);
            }
           
        }
    }
}

export default TikTokBrandsService;
