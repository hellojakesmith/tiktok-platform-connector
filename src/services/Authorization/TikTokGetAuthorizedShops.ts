import axios from 'axios';
import { TIKTOK_APP_KEY, TIK_TOK_SELLER_ID } from '../../constants';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature'; 
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens'
import TikTokAuthorizedShops from '../../database/Authorization/TikTokShopAuthorizedShops'; // Import the AuthorizedShops class
import { TIK_TOK_SHOP_OPEN_API_URL } from '../../constants'
interface ITikTokShop {
    id: string;
    name: string;
    region: string;
    seller_type: string;
    cipher: string;
    code: string;
}


class TikTokAuthorizedShopsService {
    private authorizedShopsDB: TikTokAuthorizedShops;

    constructor() {
        this.authorizedShopsDB = new TikTokAuthorizedShops();
    }

    public async getAuthorizedShops() {
        const tikTokShopTokens = new TikTokShopAccessTokens()
        const tokens = await tikTokShopTokens.getShopTokenBySlug(TIK_TOK_SELLER_ID);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/authorization/202309/shops'; 
        
        const params = {
            app_key: TIKTOK_APP_KEY,
            access_token: tokens.access_token,
            timestamp: timestamp,
        };

        const sign = TikTokGenerateSignature(path, params);

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?app_key=${TIKTOK_APP_KEY}&sign=${sign}&timestamp=${timestamp}`;
        
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
                throw new Error(`Error fetching authorized shops: ${JSON.stringify(response.data)}`);
            }

            // Store the fetched shops in the database
            const shops: ITikTokShop[] = response.data.data.shops;
            await Promise.all(shops.map(shop => {
                return this.authorizedShopsDB.upsertShop({
                    id: shop.id,
                    name: shop.name,
                    region: shop.region,
                    seller_type: shop.seller_type,
                    cipher: shop.cipher,
                    code: shop.code,
                    seller_id: TIK_TOK_SELLER_ID // Include the seller_id
                });
            }));

            return response.data;
          
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                throw new Error(`Error fetching authorized shops: ${error.message}`);
            } else {
                throw new Error(`Error fetching authorized shops`);
            }
        }
    }
}

export default TikTokAuthorizedShopsService;
