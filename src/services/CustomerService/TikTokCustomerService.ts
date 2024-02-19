import axios from 'axios';
import { TIKTOK_APP_KEY, TIK_TOK_SHOP_OPEN_API_URL } from '../../constants';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens';
import AuthorizedShops from '../../database/Authorization/TikTokShopAuthorizedShops';
import FormData from 'form-data';
import fs from 'fs';

class CustomerService {
    private tikTokShopTokens: TikTokShopAccessTokens;
    private authorizedShops: AuthorizedShops;

    constructor() {
        this.tikTokShopTokens = new TikTokShopAccessTokens();
        this.authorizedShops = new AuthorizedShops();
    }

    public async createConversation(shopId: string, buyerUserId: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/customer_service/202309/conversations';

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const requestBody = {
            buyer_user_id: buyerUserId,
        };

        const sign = TikTokGenerateSignature(path, params, JSON.stringify(requestBody));

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token,
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error creating conversation: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the conversation ID and other relevant information
        } catch (error) {
            throw new Error(`Error creating conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getConversationMessages(shopId: string, conversationId: string, pageToken?: string, pageSize: number = 10, locale: string = 'en', sortOrder: string = 'create_time', sortField: string = 'DESC') {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/customer_service/202309/conversations/${conversationId}/messages`;

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
            page_token: pageToken as string,
            page_size: `${pageSize}`,
            locale,
            sort_order: sortOrder,
            sort_field: sortField,
        };

        const sign = TikTokGenerateSignature(path, params);

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token,
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error getting conversation messages: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the messages and pagination info
        } catch (error) {
            throw new Error(`Error getting conversation messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getConversations(shopId: string, pageToken?: string, pageSize: number = 10, locale: string = 'en') {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/customer_service/202309/conversations';

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
            page_token: pageToken as string,
            page_size: pageSize.toString(),
            locale,
        };

        const sign = TikTokGenerateSignature(path, params);

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token,
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error getting conversations: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the conversations list and pagination info
        } catch (error) {
            throw new Error(`Error getting conversations: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    public async sendMessage(shopId: string, conversationId: string, messageType: string, messageContent: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/customer_service/202309/conversations/${conversationId}/messages`;

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const requestBody = {
            type: messageType,
            content: JSON.stringify({ content: messageContent }),
        };

        const sign = TikTokGenerateSignature(path, params, JSON.stringify(requestBody));

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token,
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error sending message: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the message ID and other relevant information
        } catch (error) {
            throw new Error(`Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getAgentSettings(shopId: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/customer_service/202309/agents/settings';

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const queryParams = new URLSearchParams({
            ...params,
            access_token: tokens.access_token,
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error getting agent settings: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the agent settings
        } catch (error) {
            throw new Error(`Error getting agent settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async updateAgentSettings(shopId: string, canAcceptChat: boolean) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/customer_service/202309/agents/settings';

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const requestBody = {
            can_accept_chat: canAcceptChat,
        };

        const sign = TikTokGenerateSignature(path, params, JSON.stringify(requestBody));

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token,
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.put(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error updating agent settings: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the success response
        } catch (error) {
            throw new Error(`Error updating agent settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    public async readMessage(shopId: string, conversationId: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/customer_service/202309/conversations/${conversationId}/messages/read`;

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const sign = TikTokGenerateSignature(path, params);

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token,
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        try {
            const response = await axios.post(url, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error reading message: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the success response
        } catch (error) {
            throw new Error(`Error reading message: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async uploadBuyerMessageImage(shopId: string, imagePath: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/customer_service/202309/images/upload';

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const sign = TikTokGenerateSignature(path, params);

        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token,
        }).toString();

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

        const formData = new FormData();
        formData.append('data', fs.createReadStream(imagePath));

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'x-tts-access-token': tokens.access_token,
                },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error uploading image: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the image URL and dimensions
        } catch (error) {
            throw new Error(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

}

export default CustomerService;
