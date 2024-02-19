import express from 'express';
import TikTokReturnsService from '../../services/Returns/TikTokReturnsService'; // Adjust the path as necessary

class ReturnsController {
    private service: TikTokReturnsService;

    constructor() {
        this.service = new TikTokReturnsService();
    }

    public async approveReturn(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is in the route
            const returnId = req.params.returnId; // Assuming returnId is in the route
            const requestBody = req.body; // Contains decision and buyer_keep_item

            const result = await this.service.approveReturn(shopId, returnId, requestBody);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error approving return: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    public async rejectReturn(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is in the route
            const returnId = req.params.returnId; // Assuming returnId is in the route
            const requestBody = req.body; // Contains decision, reject_reason, optional comment, and images

            const result = await this.service.rejectReturn(shopId, returnId, requestBody);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error rejecting return: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getReturnRecords(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is in the route
            const returnId = req.params.returnId; // Assuming returnId is in the route
            const locale = req.query.locale ?  req.query.locale :  'en-US' as string; // Optional: Handle locale if needed

            const records = await this.service.getReturnRecords(shopId, returnId, locale as string);
            res.json(records);
        } catch (error) {
            res.status(500).send(`Error getting return records: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async searchReturns(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is part of the route parameter
            const requestBody = req.body; // Contains search criteria for returns

            // Invoke the searchReturns method of the service with the shop ID and request body
            const returns = await this.service.searchReturns(shopId, requestBody);
            res.json(returns); // Send the search results back to the client
        } catch (error) {
            // Error handling: Log the error or send a specific message back to the client
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error searching returns: ' + error.message);
            } else {
                res.status(500).send('Error searching returns');
            }
        }
    }

    public async createReturn(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is part of the route parameter
            const requestBody = req.body; // Contains search criteria for returns

            // Invoke the searchReturns method of the service with the shop ID and request body
            const returns = await this.service.createReturn(shopId, requestBody);
            res.json(returns); // Send the search results back to the client
        } catch (error) {
            // Error handling: Log the error or send a specific message back to the client
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error searching returns: ' + error.message);
            } else {
                res.status(500).send('Error searching returns');
            }
        }
    }
}

export default ReturnsController;
