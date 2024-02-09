import express from 'express';
import TikTokWarehouseService from '../../services/Logistics/TikTokShopGetWarehouseList';

class WarehouseController {
    private service: TikTokWarehouseService;

    constructor() {
        this.service = new TikTokWarehouseService();
    }

    public async getWarehouses(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId;
            const warehouses = await this.service.getWarehouses(shopId);
            res.json(warehouses);
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error fetching warehouses: ' + error.message);
            } else {
                res.status(500).send('Error fetching warehouses');
            }
        }
    }
}

export default WarehouseController;
