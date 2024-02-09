import axios from 'axios';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import { TIKTOK_APP_KEY, TIK_TOK_SHOP_OPEN_API_URL } from '../../constants';

class TikTokUpdateShopWebhookService {
    public async updateShopWebhook(shopCipher: string) {
        const path = '/event/202309/webhooks';
        const timestamp = Math.floor(Date.now() / 1000);
        const params = {
            app_key: TIKTOK_APP_KEY,
            shop_cipher: shopCipher,
            timestamp: timestamp
        };

        const sign = TikTokGenerateSignature(path, params);
        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}`;

        try {
            const response = await axios.put(url, {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    ...params,
                    sign: sign
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching shop webhooks: ${error}`);
        }
    }
}

export default TikTokUpdateShopWebhookService;
