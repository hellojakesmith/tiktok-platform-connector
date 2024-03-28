// services/Fulfillments/TikTokFulfillmentService.ts

import axios from 'axios';
import { TIKTOK_APP_KEY, TIK_TOK_SHOP_OPEN_API_URL } from '../../constants';
import TikTokGenerateSignature from '../../utils/TikTokGenerateSignature';
import TikTokShopAccessTokens from '../../database/Authorization/TikTokShopAccessTokens';
import AuthorizedShops from '../../database/Authorization/TikTokShopAuthorizedShops';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

class FulfillmentService {
    private tikTokShopTokens: TikTokShopAccessTokens;
    private authorizedShops: AuthorizedShops;

    constructor() {
        this.tikTokShopTokens = new TikTokShopAccessTokens();
        this.authorizedShops = new AuthorizedShops();
    }

    public async searchPackages(shopId: string, requestBody: any, queryParameters: any) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/fulfillment/202309/packages/search';

        const sign = TikTokGenerateSignature(path, { ...queryParameters, app_key: TIKTOK_APP_KEY, timestamp }, JSON.stringify(requestBody));

        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${new URLSearchParams({ ...queryParameters, sign, app_key: TIKTOK_APP_KEY, timestamp, access_token: tokens.access_token }).toString()}`;

        try {
            const response = await axios.post(url, requestBody, {
                headers: { 'Content-Type': 'application/json', 'x-tts-access-token': tokens.access_token },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error searching packages: ${JSON.stringify(response.data)}`);
            }

            return response.data.data;
        } catch (error) {
            throw new Error(`Error searching packages: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    public async getPackageDetail(shopId: string, packageId: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/fulfillment/202309/packages/${packageId}`;

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
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-tts-access-token': tokens.access_token,
                },
            });

            if (response.data.code !== 0) {
                throw new Error(`Error getting package detail: ${JSON.stringify(response.data)}`);
            }

            return response.data.data;
        } catch (error) {
            throw new Error(`Error getting package detail: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getPackageShippingDocument(shopId: string, packageId: string, documentType: string, documentSize?: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/fulfillment/202309/packages/${packageId}/shipping_documents`;

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
            document_type: documentType,
            document_size: documentSize as string,
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
                throw new Error(`Error getting package shipping document: ${JSON.stringify(response.data)}`);
            }

            return response.data.data;
        } catch (error) {
            throw new Error(`Error getting package shipping document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getPackageHandoverTimeSlots(shopId: string, packageId: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/fulfillment/202309/packages/${packageId}/handover_time_slots`;

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
                throw new Error(`Error getting package handover time slots: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the handover time slots and other related information
        } catch (error) {
            throw new Error(`Error getting package handover time slots: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getOrderTracking(shopId: string, orderId: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/fulfillment/202309/orders/${orderId}/tracking`;

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
                throw new Error(`Error fetching order tracking information: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the tracking information
        } catch (error) {
            throw new Error(`Error fetching order tracking information: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async updatePackageShippingInfo(shopId: string, packageId: string, trackingNumber: string, shippingProviderId: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/fulfillment/202309/packages/${packageId}/shipping_info/update`;

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const requestBody = {
            tracking_number: trackingNumber,
            shipping_provider_id: shippingProviderId,
        };

        const queryParams = new URLSearchParams({
            ...params,
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
                throw new Error(`Error updating package shipping info: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the update confirmation
        } catch (error) {
            throw new Error(`Error updating package shipping info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async updatePackageDeliveryStatus(shopId: string, packages: Array<{ id: string; delivery_type: string; fail_delivery_reason?: string; file_type?: string; file_url?: string; }>) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/fulfillment/202309/packages/deliver`;

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const requestBody = {
            packages,
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
                throw new Error(`Error updating package delivery status: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the response data or errors if any
        } catch (error) {
            throw new Error(`Error updating package delivery status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async markPackageAsShipped(shopId: string, orderId: string, orderLineItemIds: string[], trackingNumber: string, shippingProviderId: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/fulfillment/202309/orders/${orderId}/packages`;

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const requestBody = {
            order_line_item_ids: orderLineItemIds,
            tracking_number: trackingNumber,
            shipping_provider_id: shippingProviderId,
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
                throw new Error(`Error marking package as shipped: ${JSON.stringify(response.data)}`);
            }

            return response.data.data; // Returning the response data including package ID and any warnings
        } catch (error) {
            throw new Error(`Error marking package as shipped: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async shipPackage(shopId: string, packageId: string, handoverMethod: string, pickupSlot: any, selfShipment: any) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

        const timestamp = Math.floor(Date.now() / 1000);
        const path = `/fulfillment/202309/packages/${packageId}/ship`;

        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };

        const requestBody = {
            ...(handoverMethod ? { handover_method: handoverMethod } : {}),
            ...(pickupSlot ? { pickup_slot: pickupSlot } : {}),
            ...(selfShipment ? { self_shipment: selfShipment } : {}),
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
                throw new Error(`Error shipping package: ${JSON.stringify(response.data)}`);
            }

            return response.data.data;
        } catch (error) {
            throw new Error(`Error shipping package: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async uploadDeliveryImage(shopId: string, imagePath: string) {
        const shop = await this.authorizedShops.getShopById(shopId);
        const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);
    
        const timestamp = Math.floor(Date.now() / 1000);
        const path = '/fulfillment/202309/images/upload';
    
        const params = {
            app_key: TIKTOK_APP_KEY,
            timestamp: `${timestamp}`,
            shop_cipher: shop.cipher,
        };
    
        const formData = new FormData();
        formData.append('data', fs.createReadStream(imagePath));
        
        // const sign = TikTokGenerateSignature(path, params, formData);
        const sign = TikTokGenerateSignature(path, params);
    
        const queryParams = new URLSearchParams({
            ...params,
            sign: sign,
            access_token: tokens.access_token,
        }).toString();
    
        const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;
    
        try {
            const response = await axios.post(url, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'x-tts-access-token': tokens.access_token,
                },
            });
    
            if (response.data.code !== 0) {
                throw new Error(`Error uploading delivery image: ${JSON.stringify(response.data)}`);
            }
    
            return response.data.data;
        } catch (error) {
            throw new Error(`Error uploading delivery image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // In FulfillmentService.ts

public async uploadDeliveryFile(shopId: string, filePath: string, fileName: string) {
    const shop = await this.authorizedShops.getShopById(shopId);
    const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/fulfillment/202309/files/upload';

    const params = {
        app_key: TIKTOK_APP_KEY,
        timestamp: `${timestamp}`,
        shop_cipher: shop.cipher,
    };

    const formData = new FormData();
    formData.append('data', fs.createReadStream(filePath));
    formData.append('name', fileName);

   // const sign = TikTokGenerateSignature(path, params, formData);
   const sign = TikTokGenerateSignature(path, params);

    const queryParams = new URLSearchParams({
        ...params,
        sign: sign,
        access_token: tokens.access_token,
    }).toString();

    const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

    try {
        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                'x-tts-access-token': tokens.access_token,
            },
        });

        if (response.data.code !== 0) {
            throw new Error(`Error uploading delivery file: ${JSON.stringify(response.data)}`);
        }

        return response.data.data; // Returning the file URL and other relevant information
    } catch (error) {
        throw new Error(`Error uploading delivery file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

public async getEligibleShippingServices(shopId: string, orderId: string, packageDetails: any) {
    const shop = await this.authorizedShops.getShopById(shopId);
    const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

    const timestamp = Math.floor(Date.now() / 1000);
    const path = `/fulfillment/202309/orders/${orderId}/shipping_services/query`;

    const params = {
        app_key: TIKTOK_APP_KEY,
        timestamp: `${timestamp}`,
        shop_cipher: shop.cipher,
    };

    const sign = TikTokGenerateSignature(path, params, JSON.stringify(packageDetails));

    const queryParams = new URLSearchParams({
        ...params,
        sign: sign,
        access_token: tokens.access_token,
    }).toString();

    const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

    try {
        const response = await axios.post(url, packageDetails, {
            headers: {
                'Content-Type': 'application/json',
                'x-tts-access-token': tokens.access_token,
            },
        });

        if (response.data.code !== 0) {
            throw new Error(`Error querying shipping services: ${JSON.stringify(response.data)}`);
        }

        return response.data.data; // Returning the list of eligible shipping services
    } catch (error) {
        throw new Error(`Error querying shipping services: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

public async createPackage(shopId: string, packageDetails: any) {
    const shop = await this.authorizedShops.getShopById(shopId);
    const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/fulfillment/202309/packages';

    const params = {
        app_key: TIKTOK_APP_KEY,
        timestamp: `${timestamp}`,
        shop_cipher: shop.cipher,
    };

    const sign = TikTokGenerateSignature(path, params, JSON.stringify(packageDetails));

    const queryParams = new URLSearchParams({
        ...params,
        sign: sign,
        access_token: tokens.access_token,
    }).toString();

    const url = `${TIK_TOK_SHOP_OPEN_API_URL}${path}?${queryParams}`;

    try {
        const response = await axios.post(url, packageDetails, {
            headers: {
                'Content-Type': 'application/json',
                'x-tts-access-token': tokens.access_token,
            },
        });

        if (response.data.code !== 0) {
            throw new Error(`Error creating package: ${JSON.stringify(response.data)}`);
        }

        return response.data.data; // Returning the package creation confirmation and details
    } catch (error) {
        throw new Error(`Error creating package: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

public async updateShippingInfo(shopId: string, orderId: string, trackingNumber: string, shippingProviderId: string) {
    const shop = await this.authorizedShops.getShopById(shopId);
    const tokens = await this.tikTokShopTokens.getShopTokenBySlug(shop.seller_id);

    const timestamp = Math.floor(Date.now() / 1000);
    const path = `/fulfillment/202309/orders/${orderId}/shipping_info/update`;

    const params = {
        app_key: TIKTOK_APP_KEY,
        timestamp: `${timestamp}`,
        shop_cipher: shop.cipher,
    };

    const requestBody = {
        tracking_number: trackingNumber,
        shipping_provider_id: shippingProviderId,
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
            throw new Error(`Error updating shipping info: ${JSON.stringify(response.data)}`);
        }

        return response.data.data; // Returning the success response
    } catch (error) {
        throw new Error(`Error updating shipping info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}



}

export default FulfillmentService;
