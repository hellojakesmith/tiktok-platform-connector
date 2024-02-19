import express from 'express';
import TikTokCustomerService from '../../services/CustomerService/TikTokCustomerService';

class CustomerServiceController {
    private service: TikTokCustomerService;

    constructor() {
        this.service = new TikTokCustomerService();
    }

    public async createConversation(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is in the route
            const { buyerUserId } = req.body; // Extract buyerUserId from request body

            const result = await this.service.createConversation(shopId, buyerUserId);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error creating conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Inside CustomerServiceController class

    public async getConversationMessages(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is in the route
            const conversationId = req.params.conversationId; // Extract conversationId from route parameters
            const { pageToken, pageSize, locale, sortOrder, sortField } = req.query;

            const messages = await this.service.getConversationMessages(shopId, conversationId, pageToken as string, parseInt(pageSize as string), locale as string, sortOrder as string, sortField as string);
            res.json(messages);
        } catch (error) {
            res.status(500).send(`Error getting conversation messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getConversations(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is in the route
            const { pageToken, pageSize, locale } = req.query;

            const conversations = await this.service.getConversations(shopId, pageToken as string, parseInt(pageSize as string, 10), locale as string);
            res.json(conversations);
        } catch (error) {
            res.status(500).send(`Error getting conversations: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    public async sendMessage(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is in the route
            const conversationId = req.params.conversationId; // Assuming conversationId is in the route
            const { type, content } = req.body; // Extract message type and content from request body

            const result = await this.service.sendMessage(shopId, conversationId, type, content);
            res.json({ message_id: result.message_id });
        } catch (error) {
            res.status(500).send(`Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getAgentSettings(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is in the route

            const settings = await this.service.getAgentSettings(shopId);
            res.json(settings);
        } catch (error) {
            res.status(500).send(`Error getting agent settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async updateAgentSettings(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is in the route
            const { canAcceptChat } = req.body; // Extract canAcceptChat from request body

            const result = await this.service.updateAgentSettings(shopId, canAcceptChat);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error updating agent settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    public async readMessage(req: express.Request, res: express.Response) {
        try {
            const shopId = req.params.shopId; // Assuming shopId is in the route
            const conversationId = req.params.conversationId; // Extract conversationId from route parameters

            const result = await this.service.readMessage(shopId, conversationId);
            res.json(result);
        } catch (error) {
            res.status(500).send(`Error reading message: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async uploadImage(req: express.Request, res: express.Response) {
        try {
          const shopId = req.params.shopId;
          if (!req.file) {
            throw new Error("No file uploaded.");
          }
          const imagePath = req.file.path;
    
          const result = await this.service.uploadBuyerMessageImage(shopId, imagePath);
          res.json(result);
        } catch (error) {
          res.status(500).send(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

}

export default CustomerServiceController;
