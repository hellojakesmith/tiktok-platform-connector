import axios from 'axios';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import { TIKTOK_APP_KEY } from '../../constants';

class TikTokGetShopWebhooksService {
    public async getShopWebhooks(shopCipher: string) {
        const path = '/event/202309/webhooks';
        const timestamp = Math.floor(Date.now() / 1000);
        const params = {
            app_key: TIKTOK_APP_KEY,
            shop_cipher: shopCipher,
            timestamp: timestamp
        };

        const sign = TikTokGenerateSignature(path, params);
        const url = `https://open-api.tiktokglobalshop.com${path}`;

        try {
            const response = await axios.get(url, {
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

export default TikTokGetShopWebhooksService;
