import axios from 'axios';
import { ITikTokShopTokens } from '../../interfaces';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import { TIKTOK_APP_KEY, TIK_TOK_APP_SECRET, TIK_TOK_SELLER_ID } from '../../constants';

class TikTokSellerPermissionsService {
    async getSellerPermissions(tokens: ITikTokShopTokens): Promise<string[]> {
        const path = '/seller/202309/permissions';
        const url = 'https://open-api.tiktokglobalshop.com' + path;
        const { access_token } = tokens;

        const timestamp = Math.floor(Date.now() / 1000);

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp,
            access_token,
            // Additional parameters if required
        };

        // Include the path in the signature generation
        const sign = TikTokGenerateSignature(path, params);

        try {
            const response = await axios.get(url, { params: {...params, sign} });
            if (response.data.code === 0) {
                return response.data.data.permissions;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            throw new Error("Error retrieving seller permissions: " + error);
        }
    }
}

export default TikTokSellerPermissionsService;
