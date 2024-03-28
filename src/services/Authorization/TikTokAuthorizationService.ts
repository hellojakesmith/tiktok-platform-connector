import axios from 'axios';
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens';
import { TIKTOK_APP_KEY, TIK_TOK_APP_SECRET, TIK_TOK_SELLER_ID, TIK_TOK_APP_ID } from '../../constants';
import { ITikTokShopTokens } from '../../interfaces';

class TikTokAuthorizationService {
    private accessTokenManager: TikTokShopAccessTokens;

    constructor() {
        this.accessTokenManager = new TikTokShopAccessTokens();
    }

    generateAuthLink() {
        const service_id = TIK_TOK_APP_ID;
        const state = TIK_TOK_SELLER_ID; // This should be a securely generated random string
        return `https://services.tiktokshop.com/open/authorize?service_id=${service_id}&state=${encodeURIComponent(state)}`;
    }

    async requestAccessToken(authCode: string): Promise<ITikTokShopTokens> {
        const app_key = TIKTOK_APP_KEY;
        const app_secret = TIK_TOK_APP_SECRET;
        const url = `https://auth.tiktok-shops.com/api/v2/token/get`;
        const params = { app_key, app_secret, auth_code: authCode, grant_type: 'authorized_code' };

        try {
            const response = await axios.get(url, { params });
            const data = response.data.data;

            const tokens: ITikTokShopTokens = {
                seller_id: TIK_TOK_SELLER_ID,
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                access_token_expire_in: data.access_token_expire_in,
                refresh_token_expire_in: data.refresh_token_expire_in,
                open_id: data.open_id,
                seller_name: data.seller_name,
                seller_base_region: data.seller_base_region,
                user_type: data.user_type
            };

            await this.accessTokenManager.upsertShopTokens(tokens);
            return tokens;
        } catch (error) {
            throw new Error("Error requesting access token: " + error);
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<ITikTokShopTokens> {
        const url = 'https://auth.tiktok-shops.com/api/v2/token/refresh';
        const params = {
            app_key: TIKTOK_APP_KEY,
            app_secret: TIK_TOK_APP_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        };

        try {
            const response = await axios.get(url, { params });
            const data = response.data.data;

            const updatedTokens: ITikTokShopTokens = {
                seller_id: TIK_TOK_SELLER_ID, // Assuming this remains unchanged
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                access_token_expire_in: data.access_token_expire_in,
                refresh_token_expire_in: data.refresh_token_expire_in,
                open_id: data.open_id, // Include this if your ITikTokShopTokens interface has it
                seller_name: data.seller_name, // Include if applicable
                seller_base_region: data.seller_base_region, // Include if applicable
                user_type: data.user_type // Include if applicable
            };

            await this.accessTokenManager.upsertShopTokens(updatedTokens);
            return updatedTokens;
        } catch (error) {
            throw new Error('Error refreshing access token: ' + error);
        }
    }
}

export default TikTokAuthorizationService;
