import express from 'express';
import TikTokCancellationsService from '../../services/Cancellations/TikTokSearchCancellations'; // Adjust the path as necessary

class CancellationsController {
    private service: TikTokCancellationsService;

    constructor() {
        this.service = new TikTokCancellationsService();
    }

    public async searchCancellations(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is required for this operation
            const requestBody = req.body; // Body should contain cancellation search criteria

            const cancellations = await this.service.searchCancellations(shopId, requestBody);
            res.json(cancellations);
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error searching cancellations: ' + error.message);
            } else {
                res.status(500).send('Error searching cancellations');
            }
        }
    }
}

export default CancellationsController;
