import express from 'express';
import TikTokAuthorizationController from '../controllers/Authorization/TikTokAuthorizationController';
import TikTokAuthorizedShopsController from '../controllers/Authorization/TikTokAuthorizedShopsController';
import TikTokGetShopWebhooksController from '../controllers/Events/TikTokGetShopWebhooksController';
import TikTokSellerPermissionsController from '../controllers/Seller/TikTokSellerPermissionsController';

const router = express.Router();

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

router.get('/shop-webhooks', async (req, res) => {
  const controller = new TikTokGetShopWebhooksController();
  await controller.getShopWebhooks(req, res)
});

router.get('/seller-permissions', async (req, res) => {
  const controller = new TikTokSellerPermissionsController();
  await controller.getSellerPermissions(req, res)

});


export default router;
