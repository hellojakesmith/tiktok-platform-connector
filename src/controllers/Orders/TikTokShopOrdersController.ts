import express from 'express';
import TikTokOrdersService from '../../services/Orders/TikTokOrdersService'; // Adjust the path as necessary

class OrdersController {
    private service: TikTokOrdersService;

    constructor() {
        this.service = new TikTokOrdersService();
    }

    public async getOrders(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Extracting shopId from route parameters
            const requestBody = req.body;

            const orders = await this.service.getOrderList(shopId, requestBody);
            res.json(orders);
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error retrieving orders: ' + error.message);
            } else {
                res.status(500).send('Error retrieving orders');
            }
        }
    }
}

export default OrdersController;
