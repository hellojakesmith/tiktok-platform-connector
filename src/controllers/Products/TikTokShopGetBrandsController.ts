import express from 'express';
import TikTokBrandsService from '../../services/Products/TikTokGetBrandsService'; // Adjust the path as necessary

class BrandsController {
    private service: TikTokBrandsService;

    constructor() {
        this.service = new TikTokBrandsService();
    }

    public async getBrands(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is part of the route parameter
            const pageSize = parseInt(req.query.page_size as string);
            const pageToken = req.query.page_token as string | undefined;
            const categoryId = req.query.category_id as string | undefined;
            const isAuthorized = req.query.is_authorized === 'true';
            const brandName = req.query.brand_name as string | undefined;

            const brands = await this.service.getBrands(shopId, pageSize, pageToken, categoryId, isAuthorized, brandName);
            res.json(brands);
        } catch (error) {
            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error retrieving brands: ' + error.message);
            } else {
                res.status(500).send('Error retrieving brands');
            }
        }
    }
}

export default BrandsController;
