import express from 'express';
import TikTokWarehouseDeliveryOptionsService from '../../services/Logistics/TikTokWarehouseDeliveryOptionsService';

class WarehouseDeliveryOptionsController {
    private service: TikTokWarehouseDeliveryOptionsService;

    constructor() {
        this.service = new TikTokWarehouseDeliveryOptionsService();
    }

    public async getDeliveryOptions(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId;
            const warehouseId = req.params.warehouseId;
            const deliveryOptions = await this.service.getDeliveryOptions(shopId, warehouseId);
            res.json(deliveryOptions);
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error fetching delivery options: ' + error.message);
            } else {
                res.status(500).send('Error fetching delivery options');
            }
        }
    }
}

export default WarehouseDeliveryOptionsController;
