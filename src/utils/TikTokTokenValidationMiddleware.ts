import express from 'express';
import TikTokAuthorizationService from '../services/Authorization/TikTokAuthorizationService';
import TikTokShopAccessTokens from '../database/Authorization/TikTokShopAccessTokens';

const tokenValidationMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const accessTokenManager = new TikTokShopAccessTokens();
    const authService = new TikTokAuthorizationService();

    // Assuming shopSlug or some identifier is available in the request
    const shopSlug = req.params.SELLER_ID;
    const tokens = await accessTokenManager.getShopTokenBySlug(shopSlug);

    if (!tokens) {
        return res.status(401).send('Authentication required');
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > tokens.refresh_token_expire_in) {
        // Refresh token expired, redirect to authorization link
        const authLink = authService.generateAuthLink();
        return res.redirect(authLink);
    } else if (currentTime > tokens.access_token_expire_in) {
        // Access token expired, refresh it
        const updatedTokens = await authService.refreshAccessToken(tokens.refresh_token);
        await accessTokenManager.upsertShopTokens(updatedTokens);
        req.tokens = updatedTokens; // Attach new tokens to request for downstream use
        next();
    } else {
        // Tokens are valid
        req.tokens = tokens; // Attach current tokens to request for downstream use
        next();
    }
};

export default tokenValidationMiddleware;
