
import { Request, Response } from 'express';
import FulfillmentService from '../../services/Fulfillments/TikTokFulfillmentService';

class FulfillmentController {
    private service: FulfillmentService;

    constructor() {
        this.service = new FulfillmentService();
    }

    public async searchPackages(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId;
            const result = await this.service.searchPackages(shopId, req.body, req.query);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error searching packages: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    public async getPackageDetail(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId;
            const packageId = req.params.packageId;

            const packageDetail = await this.service.getPackageDetail(shopId, packageId);
            res.json(packageDetail);
        } catch (error) {
            res.status(500).send(`Error getting package detail: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getPackageShippingDocument(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId;
            const packageId = req.params.packageId;
            const { documentType, documentSize } = req.query;

            const document = await this.service.getPackageShippingDocument(shopId, packageId, documentType as string, documentSize as string);
            res.json(document);
        } catch (error) {
            res.status(500).send(`Error getting package shipping document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getPackageHandoverTimeSlots(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId;
            const packageId = req.params.packageId;

            const timeSlots = await this.service.getPackageHandoverTimeSlots(shopId, packageId);
            res.json(timeSlots);
        } catch (error) {
            res.status(500).send(`Error getting package handover time slots: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getOrderTracking(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId;
            const orderId = req.params.orderId;

            const trackingInfo = await this.service.getOrderTracking(shopId, orderId);
            res.json(trackingInfo);
        } catch (error) {
            res.status(500).send(`Error fetching order tracking information: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async updatePackageShippingInfo(req: Request, res: Response) {
        try {
            const { shopId, packageId } = req.params;
            const { trackingNumber, shippingProviderId } = req.body;

            const result = await this.service.updatePackageShippingInfo(shopId, packageId, trackingNumber, shippingProviderId);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error updating package shipping info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async updatePackageDeliveryStatus(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId;
            const packages = req.body.packages;

            const result = await this.service.updatePackageDeliveryStatus(shopId, packages);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error updating package delivery status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async markPackageAsShipped(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is provided in the route
            const { orderId, orderLineItemIds, trackingNumber, shippingProviderId } = req.body;

            const result = await this.service.markPackageAsShipped(shopId, orderId, orderLineItemIds, trackingNumber, shippingProviderId);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error marking package as shipped: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async shipPackage(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is provided in the route
            const packageId = req.params.packageId; // Assuming packageId is provided in the route
            const { handoverMethod, pickupSlot, selfShipment } = req.body;

            const result = await this.service.shipPackage(shopId, packageId, handoverMethod, pickupSlot, selfShipment);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error shipping package: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async uploadDeliveryImage(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is provided in the route
            const file = req.file; // Assuming file is uploaded and available in req.file

            if (!file || !file.path) {
                return res.status(400).send("No image file provided.");
            }

            const result = await this.service.uploadDeliveryImage(shopId, file.path);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error uploading delivery image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async uploadDeliveryFile(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId;
            const file = req.file; // Assuming file is uploaded and available in req.file

            if (!file || !file.path) {
                return res.status(400).send("No file provided.");
            }

            const result = await this.service.uploadDeliveryFile(shopId, file.path, file.originalname);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error uploading delivery file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getEligibleShippingServices(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId;
            const orderId = req.params.orderId;
            const packageDetails = req.body; // Assuming package details are provided in the request body
    
            const shippingServices = await this.service.getEligibleShippingServices(shopId, orderId, packageDetails);
            res.json(shippingServices);
        } catch (error) {
            res.status(500).send(`Error querying shipping services: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async createPackage(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is extracted from authentication context or route parameters
            const packageDetails = req.body; // Package details from the request body
    
            const result = await this.service.createPackage(shopId, packageDetails);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error creating package: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async updateShippingInfo(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is extracted from authentication context or route parameters
            const { orderId, trackingNumber, shippingProviderId } = req.body; // Extracting details from request body
    
            const result = await this.service.updateShippingInfo(shopId, orderId, trackingNumber, shippingProviderId);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error updating shipping info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export default FulfillmentController;
