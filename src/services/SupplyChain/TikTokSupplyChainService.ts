import axios from 'axios';
import { TIKTOK_APP_KEY, TIK_TOK_SHOP_OPEN_API_URL } from '../../constants';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens';
import AuthorizedShops from '../../database/Authorization/TikTokShopAuthorizedShops';

class SupplyChainService {
    private tikTokShopTokens: TikTokShopAccessTokens;
    private authorizedShops: AuthorizedShops;

    constructor() {
        this.tikTokShopTokens = new TikTokShopAccessTokens();
        this.authorizedShops = new AuthorizedShops();
    }

    public async confirmPackageShipment(shopId: string, warehouseProviderId: string, packages: any[]) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/supply_chain/202309/packages/sync`;

        const requestBody = {
            warehouse_provider_id: warehouseProviderId,
            packages,
        };

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const sign = TikTokGenerateSignature(path, params, JSON.stringify(requestBody));

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token,
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error confirming package shipment: ${JSON.stringify(response.data)}`);
            }

            return response.data;
        } catch (error) {
            throw new Error(`Error confirming package shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export default new SupplyChainService();
