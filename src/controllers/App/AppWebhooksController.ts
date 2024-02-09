import express from 'express';

class AppWebhooksController {

    constructor() {
    
    }

    public async appWebhooks(req: express.Request, res: express.Response) {
        try {
            console.log(req.headers)
            console.log(req.body)
            res.json("ok");
        } catch (error) {

            if (typeof error === "object" && error !== null && 'message' in error) {
                res.status(500).send('Error retrieving webhooks: ' + error.message);
            } else {
                res.status(500).send('Error retrieving webhooks');
            }
        }
    }
}

export default AppWebhooksController;
