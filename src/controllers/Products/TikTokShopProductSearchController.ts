import express from 'express';
import TikTokProductSearchService from '../../services/Products/TikTokShopSearchProducts';

class ProductSearchController {
    private service: TikTokProductSearchService;

    constructor() {
        this.service = new TikTokProductSearchService();
    }

    public async searchProducts(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId;
            const searchParams = req.body; // Assuming the body contains the search parameters

            const products = await this.service.searchProducts(shopId, searchParams);
            res.json(products);
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error searching products: ' + error.message);
            } else {
                res.status(500).send('Error searching products');
            }
        }
    }
}

export default ProductSearchController;
