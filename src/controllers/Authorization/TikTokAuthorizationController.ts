import express from 'express';
import TikTokAuthorizationService from '../../services/Authorization/TikTokAuthorizationService';

class TikTokAuthorizationController {
    private tikTokAuthService: TikTokAuthorizationService;


    constructor() {
        this.tikTokAuthService = new TikTokAuthorizationService();
    }

    generateAuthLink(req: express.Request, res: express.Response) {
        const authLink = this.tikTokAuthService.generateAuthLink();
        res.redirect(authLink);
    }

    async oauthCallback(req: express.Request, res: express.Response) {
        console.log({params: req.params})
        console.log({params: req.query})
        const { code, state } = req.query;

        try {
            const tokens = await this.tikTokAuthService.requestAccessToken(code as string);
            // Additional handling or response formatting
            res.send(`Access token saved successfully, ${JSON.stringify(tokens)}`);
        } catch (error) {
            res.status(500).send('Error in processing TikTok Shop OAuth callback');
        }
    }


    async refreshAuthToken(req: express.Request, res: express.Response) {
        const refreshToken = req.body.refreshToken; // Assuming the refresh token is sent in the request body

        if (!refreshToken) {
            return res.status(400).send('Refresh token is required');
        }

        try {
            const updatedTokens = await this.tikTokAuthService.refreshAccessToken(refreshToken);
            res.json({ updatedTokens });
        } catch (error) {

            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error refreshing access token: ' + error.message);
            } else {
                res.status(500).send('Error refreshing access token');
            }
            
        }
    }
}

export default TikTokAuthorizationController;
