import express from 'express';
import SupplyChainService from '../../services/SupplyChain/TikTokSupplyChainService'; // Adjust path as necessary

const router = express.Router();

router.post('/supply-chain/:shopId/packages/sync', async (req, res) => {
    try {
        const { shopId } = req.params;
        const { warehouseProviderId, packages } = req.body;
        const result = await SupplyChainService.confirmPackageShipment(shopId, warehouseProviderId, packages);
        res.json(result);
    } catch (error) {
        if (typeof error === "object" && error !== null && 'message' in error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Error sending package information back for the transaction order');
        }
    }
});

export default router;
