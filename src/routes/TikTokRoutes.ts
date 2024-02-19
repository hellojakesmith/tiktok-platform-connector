import express from 'express';
import multer from 'multer';
import TikTokAuthorizationController from '../controllers/Authorization/TikTokAuthorizationController';
import TikTokAuthorizedShopsController from '../controllers/Authorization/TikTokAuthorizedShopsController';
import TikTokGetShopWebhooksController from '../controllers/Events/TikTokGetShopWebhooksController';
import TikTokSellerPermissionsController from '../controllers/Seller/TikTokSellerPermissionsController';
import TikTokShopGetBrandsController from '../controllers/Products/TikTokShopGetBrandsController'; // Adjust the path as necessary
import TikTokShopOrdersController from '../controllers/Orders/TikTokShopOrdersController'; // Adjust the path as necessary
import TikTokShopProductSearchController from '../controllers/Products/TikTokShopProductSearchController'
import TikTokShopWarehouseController from '../controllers/Logistics/TikTokShopWarehouseController'
import TikTokShopWarehouseDeliveryOptionsController from '../controllers/Logistics/TikTokShopWarehouseDeliveryOptionsController';
import TikTokReturnsContoller from '../controllers/Returns/TikTokReturnsController'
import TikTokCustomerServiceController from '../controllers/CustomerService/TikTokCustomerServiceController';
import TikTokFulfillmentController from '../controllers/Fulfillments/TikTokFulfillmentsController';

import AppWebhooksController from '../controllers/App/AppWebhooksController';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });


const router = express.Router();

router.post('/events', async (req, res) => {
  const controller = new AppWebhooksController();

  await controller.appWebhooks(req, res)
});


router.get('/authenticate', async (req, res) => {
  const controller = new TikTokAuthorizationController();

  await controller.generateAuthLink(req, res)
});

router.get('/authorize', async (req, res) => {
  const controller = new TikTokAuthorizationController();
  await controller.oauthCallback(req, res)
});


router.get('/authorized-shops', async (req, res) => {
  console.log({ route: "authorized-shops" })
  const controller = new TikTokAuthorizedShopsController();
  await controller.getAuthorizedShops(req, res)
});

router.get('/api/shops/:shopId/brands', async (req, res) => {
  const controller = new TikTokShopGetBrandsController();
  await controller.getBrands(req, res)
});

router.post('/api/shops/:shopId/products/search', async (req, res) => {
  const controller = new TikTokShopProductSearchController();
  await controller.searchProducts(req, res)
});

router.get('/api/shops/:shopId/warehouses', async (req, res) => {
  const controller = new TikTokShopWarehouseController();
  await controller.getWarehouses(req, res)
})

router.get('/api/shops/:shopId/warehouses/:warehouseId/delivery_options', async (req, res) => {
  const controller = new TikTokShopWarehouseDeliveryOptionsController();
  await controller.getDeliveryOptions(req, res)
})

router.post('/api/shops/:shopId/orders/search', async (req, res) => {
  const controller = new TikTokShopOrdersController();
  await controller.getOrders(req, res)
});


router.get('/shop-webhooks', async (req, res) => {
  const controller = new TikTokGetShopWebhooksController();
  await controller.getShopWebhooks(req, res)
});

router.get('/seller-permissions', async (req, res) => {
  const controller = new TikTokSellerPermissionsController();
  await controller.getSellerPermissions(req, res)

});

router.post('/returns/:shopId/search', async (req, res) => {
  const controller = new TikTokReturnsContoller();
  await controller.searchReturns(req, res)
});

router.post('/returns/:shopId/:returnId/reject', async (req, res) => {
  const controller = new TikTokReturnsContoller();
  await controller.rejectReturn(req, res)
});

router.post('/returns/:shopId/:returnId/approve', async (req, res) => {
  const controller = new TikTokReturnsContoller();
  await controller.approveReturn(req, res)
});

router.post('/returns/:shopId/:returnId/reject', async (req, res) => {
  const controller = new TikTokReturnsContoller();
  await controller.rejectReturn(req, res)
});


router.get('/returns/:shopId/:returnId/records', async (req, res) => {
  const controller = new TikTokReturnsContoller();
  await controller.getReturnRecords(req, res)
});

router.get('/shops/:shopId/orders/details', async (req, res) => {
  const controller = new TikTokShopOrdersController();
  await controller.getOrderDetail(req, res);
});


router.get('/api/shops/:shopId/conversations/:conversationId/messages', async (req, res) => {
  const controller = new TikTokCustomerServiceController();
  await controller.getConversationMessages(req, res);
});


router.get('/api/shops/:shopId/conversations', async (req, res) => {
  const controller = new TikTokCustomerServiceController();
  await controller.getConversations(req, res);
});


router.get('/api/shops/:shopId/conversations/:conversationId/messages', async (req, res) => {
  const controller = new TikTokCustomerServiceController();
  await controller.sendMessage(req, res);
});

router.get('/api/shops/:shopId/customer-service/agents/settings', async (req, res) => {
  const controller = new TikTokCustomerServiceController();
  await controller.getAgentSettings(req, res);
});

router.put('/api/shops/:shopId/customer-service/agents/settings', async (req, res) => {
  const controller = new TikTokCustomerServiceController();
  await controller.updateAgentSettings(req, res);
});

router.post('/api/shops/:shopId/customer-service/conversations/:conversationId/messages/read', async (req, res) => {
  const controller = new TikTokCustomerServiceController();
  await controller.readMessage(req, res);
});

router.post('/api/shops/:shopId/customer-service/images/upload', upload.single('file'), (req, res) => {
  const controller = new TikTokCustomerServiceController();
  controller.uploadImage(req, res);
});

router.post('/api/shops/:shopId/fulfillment/packages/search', (req, res) => {
  const controller = new TikTokFulfillmentController();
  controller.searchPackages(req, res);
});

router.get('/api/shops/:shopId/fulfillment/packages/:packageId', async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.getPackageDetail(req, res);
});

router.get('/api/shops/:shopId/fulfillment/packages/:packageId/shipping_documents', async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.getPackageShippingDocument(req, res);
});

router.get('/api/shops/:shopId/fulfillment/packages/:packageId/handover_time_slots', async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.getPackageHandoverTimeSlots(req, res);
});

router.get('/api/shops/:shopId/fulfillment/orders/:orderId/tracking', async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.getOrderTracking(req, res);
});

router.post('/api/shops/:shopId/fulfillment/packages/:packageId/shipping_info/update', async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.updatePackageShippingInfo(req, res);
});

router.post('/api/fulfillment/packages/deliver', async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.updatePackageDeliveryStatus(req, res);
});

router.post('/api/fulfillment/orders/:orderId/packages', async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.markPackageAsShipped(req, res);
});

router.post('/api/fulfillment/packages/:packageId/ship', async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.shipPackage(req, res);
});

router.post('/api/fulfillment/images/upload', upload.single('data'), async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.uploadDeliveryImage(req, res);
});


router.post('/api/fulfillment/files/upload', upload.single('data'), async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.uploadDeliveryFile(req, res);
});


router.post('/api/fulfillment/orders/:orderId/shipping_services/query', async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.getEligibleShippingServices(req, res);
});

router.post('/api/fulfillment/packages',  async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.createPackage(req, res);
});

router.post('/api/fulfillment/orders/:orderId/shipping_info/update',  async (req, res) => {
  const controller = new TikTokFulfillmentController();
  await controller.updateShippingInfo(req, res);
});







export default router;
