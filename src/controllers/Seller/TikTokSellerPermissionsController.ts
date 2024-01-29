import express from 'express';
import TikTokSellerPermissionsService from '../../services/Seller/TikTokSellerPermissionsService';
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens';

class TikTokSellerPermissionsController {
    private permissionsService: TikTokSellerPermissionsService;
    private accessTokenManager: TikTokShopAccessTokens;

    constructor() {
        this.permissionsService = new TikTokSellerPermissionsService();
        this.accessTokenManager = new TikTokShopAccessTokens();
    }

    async getSellerPermissions(req: express.Request, res: express.Response) {
        try {
            const shopSlug = req.params.shopSlug; // Assuming shopSlug is passed as a URL parameter
            const tokens = await this.accessTokenManager.getShopTokenBySlug(shopSlug);

            if (!tokens) {
                return res.status(404).send('Shop tokens not found');
            }

            // Ensure the getSellerPermissions method expects an argument
            const permissions = await this.permissionsService.getSellerPermissions(tokens);
            res.json({ permissions });
        } catch (error) {
            // Handle error of unknown type
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error retrieving seller permissions: ' + error.message);
            } else {
                res.status(500).send('Error retrieving seller permissions');
            }
        }
    }
}

export default TikTokSellerPermissionsController;
