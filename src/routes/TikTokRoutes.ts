import express from 'express';
import TikTokAuthorizationController from '../controllers/Authorization/TikTokAuthorizationController';
import TikTokAuthorizedShopsController from '../controllers/Authorization/TikTokAuthorizedShopsController';
import TikTokGetShopWebhooksController from '../controllers/Events/TikTokGetShopWebhooksController';
import TikTokSellerPermissionsController from '../controllers/Seller/TikTokSellerPermissionsController';
import TikTokShopGetBrandsController from '../controllers/Products/TikTokShopGetBrandsController'; // Adjust the path as necessary
import TikTokShopOrdersController from '../controllers/Orders/TikTokShopOrdersController'; // Adjust the path as necessary
import TikTokShopProductSearchController from '../controllers/Products/TikTokShopProductSearchController'
import TikTokShopWarehouseController from '../controllers/Logistics/TikTokShopWarehouseController'
import TikTokShopWarehouseDeliveryOptionsController from '../controllers/Logistics/TikTokShopWarehouseDeliveryOptionsController';
import AppWebhooksController from '../controllers/App/AppWebhooksController';

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

router.get('/api/shops/:shopId/warehouses', async(req, res) => {
 const controller = new TikTokShopWarehouseController();
 await controller.getWarehouses(req, res)
})

router.get('/api/shops/:shopId/warehouses/:warehouseId/delivery_options', async(req, res) => {
  const controller = new TikTokShopWarehouseDeliveryOptionsController();
  await controller.getDeliveryOptions(req, res)
 })

router.post('/api/shops/:shopId/orders/search', async (req,res) => {
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


export default router;
