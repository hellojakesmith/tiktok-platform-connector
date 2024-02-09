import axios from 'axios';
import { TIKTOK_APP_KEY, TIK_TOK_SHOP_OPEN_API_URL} from '../../constants';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens';
import AuthorizedShops from '../../database/Authorization/TikTokShopAuthorizedShops';

class TikTokWarehouseService {
    private tikTokShopTokens: TikTokShopAccessTokens;
    private authorizedShops: AuthorizedShops;

    constructor() {
        this.tikTokShopTokens = new TikTokShopAccessTokens();
        this.authorizedShops = new AuthorizedShops();
    }

    public async getWarehouses(shopId: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/logistics/202309/warehouses';

        const params = {
            app_key: TIKTOK_APP_KEY as string,
            timestamp: timestamp as Number,
            shop_cipher: shop.cipher as string,
        };

        const sign = TikTokGenerateSignature(path, params);

        const queryParams = new URLSearchParams({
            ...params as unknown as string[][],
            sign: sign as string,
            access_token: tokens.access_token as string
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token
                }
            });

            if (response.data.code !== 0) {
                throw new Error(`Error fetching warehouses: ${JSON.stringify(response.data)}`);
            }

            return response.data;
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                throw new Error(`Error fetching warehouses: ${error.message || 'Unknown error'}`);
            } else {
                throw new Error(`Error fetching warehouses: 'Unknown error'}`);
            }
        }
    }
}

export default TikTokWarehouseService;
