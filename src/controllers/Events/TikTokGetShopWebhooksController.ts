import express from 'express';
import TikTokGetShopWebhooksService from '../../services/Events/TikTokGetShopWebhooksService';

class TikTokGetShopWebhooksController {
    private service: TikTokGetShopWebhooksService;

    constructor() {
        this.service = new TikTokGetShopWebhooksService();
    }

    public async getShopWebhooks(req: express.Request, res: express.Response) {
        try {
            const shopCipher = req.query.shop_cipher as string; // Ensure shop_cipher is provided
            if (!shopCipher) {
                return res.status(400).json({ error: 'Missing required query parameter: shop_cipher' });
            }

            const webhooks = await this.service.getShopWebhooks(shopCipher);
            res.json(webhooks);
        } catch (error) {

            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error retrieving webhooks: ' + error.message);
            } else {
                res.status(500).send('Error retrieving webhooks');
            }
        }
    }
}

export default TikTokGetShopWebhooksController;
