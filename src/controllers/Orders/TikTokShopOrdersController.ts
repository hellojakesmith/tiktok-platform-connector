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
            console.log({ orders })
            res.json(orders);
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error retrieving orders: ' + error.message);
            } else {
                res.status(500).send('Error retrieving orders');
            }
        }
    }

    public async getOrderDetail(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming the shop ID is part of the URL path
            
            // Initialize an empty array for orderIds
            let orderIdsArray: string[] = [];
    
            // Check if req.query.ids exists and is a string or array of strings
            const orderIds = req.query.ids;
            if (typeof orderIds === 'string') {
                // Single order ID, push to array
                orderIdsArray.push(orderIds);
            } else if (Array.isArray(orderIds)) {
                // Validate each item in the array to ensure it's a string
                orderIdsArray = orderIds.map(id => typeof id === 'string' ? id : '').filter(id => id);

            } else {
                // If orderIds is not a string or array, or is empty, throw an error
                throw new Error("Order IDs must be provided as a query parameter.");
            }
    
            // Ensure we have valid order IDs to proceed
            if (orderIdsArray.length === 0) {
                throw new Error("No valid order IDs provided.");
            }
    
            const orderDetails = await this.service.getOrderDetail(shopId, orderIdsArray);
            res.json(orderDetails);
        } catch (error) {
            res.status(500).send(`Error retrieving order details: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}`);
        }
    }

}

export default OrdersController;
