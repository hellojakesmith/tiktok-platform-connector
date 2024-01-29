const httpSignature = require('http-signature');
const { PLUGIN_SECRET } = require('../constants')
const createVerifySignatureMiddleware = () => (req, res, next) => {
    try {
        // verify Cashier's HTTP signature
        console.log(PLUGIN_SECRET)
        // a workaround to avoid failing validation if date header contains `request-target`
        const tempURL = req.url;
        req.url = req.originalUrl;
        const parsed = httpSignature.parse(req);
        req.url = tempURL;

        // this is required in order to verify that the request originated from Cashier
        if (httpSignature.verifyHMAC(parsed, PLUGIN_SECRET)) {
            next();
        } else {
            res.status(401).end();
        }
    } catch (error) {
        res.status(401).end();
    }
};

const log = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};

module.exports = {
    log,
    createVerifySignatureMiddleware,
};