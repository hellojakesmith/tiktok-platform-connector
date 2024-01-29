import axios from 'axios';
import { TIKTOK_APP_KEY, TIK_TOK_SELLER_ID } from '../../constants';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature'; // Import the signature utility
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens'
class TikTokAuthorizedShopsService {
    
    public async getAuthorizedShops() {
        const tikTokShopTokens = new TikTokShopAccessTokens()
        const tokens = await tikTokShopTokens.getShopTokenBySlug(TIK_TOK_SELLER_ID);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/authorization/202309/shops'; // API Endpoint Path
        
        const params = {
            app_key: TIKTOK_APP_KEY,
            access_token: tokens.access_token,
            timestamp: timestamp,
        };

        const sign = TikTokGenerateSignature(path, params); // Use the signature utility

        const url = `https://open-api.tiktokglobalshop.com${path}?app_key=${TIKTOK_APP_KEY}&sign=${sign}&timestamp=${timestamp}`;
        console.log({url})
        
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
            console.log(response.data)

            if (response.data.code !== 0) {
                throw new Error(`Error fetching authorized shops: ${JSON.stringify(response.data)}`);
            }
            return response.data;
          
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                console.log(error)
                throw new Error(`Error fetching authorized shops: ${error.message}`);
                
            } else {
                throw new Error(`Error fetching authorized shops`);
            }
        
        }
    }
}

export default TikTokAuthorizedShopsService;
