import express from 'express';
import TikTokGetAuthorizedShops from '../../services/Authorization/TikTokGetAuthorizedShops';

class AuthorizedShopsController {
    private service: TikTokGetAuthorizedShops;

    constructor() {
        this.service = new TikTokGetAuthorizedShops();
    }

    public async getAuthorizedShops(req: express.Request, res: express.Response) {
        try {
            const {data: shops} = await this.service.getAuthorizedShops()
            res.json(shops);
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error retrieving authorized shops: ' + error.message);
            } else {
                res.status(500).send('Error retrieving authorized shops');
            }
        }
    }
}

export default AuthorizedShopsController;
