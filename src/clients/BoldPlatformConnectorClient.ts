import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import crypto from 'crypto';

class BoldPlatformConnectorClient {
    private httpClient: AxiosInstance;
    private sharedSecret: string;

    constructor() {
        this.sharedSecret = process.env.SHARED_PLATFORM_CONNECTOR_SECRET || '';
        this.httpClient = axios.create({
            baseURL: 'https://api.boldcommerce.com/platform/v2',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
    }

    private async makeRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await this.httpClient.request(config);
            return response;
        } catch (error) {
            throw new Error(`Error making HTTP request: ${error}`);
        }
    }

    calculateHMACSignature(timestamp: string): string {
        const hmacPayload = `JAKE_CONNECTOR|${timestamp}`;
        const hmacSignature = crypto
            .createHmac('sha256', this.sharedSecret)
            .update(hmacPayload)
            .digest('hex');
        return hmacSignature;
    }

    async verifyDestination(shopIdentifier: string, timestamp: string): Promise<string> {
        const url = `/verify-destination/${shopIdentifier}`;
        const headers = {
            'X-HMAC-Timestamp': timestamp,
            'User-Agent': 'Bold-API',
            'X-HMAC': this.calculateHMACSignature(timestamp),
        };
        const config: AxiosRequestConfig = {
            method: 'GET',
            url,
            headers,
        };

        try {
            const response: AxiosResponse = await this.makeRequest(config);
            const calculatedHMAC: string = response.headers['x-hmac'] as string;
            return calculatedHMAC;
        } catch (error) {
            throw new Error(`Error verifying destination: ${error}`);
        }
    }
    async triggerDestinationSync(shopIdentifier: string, destinationId: string): Promise<void> {
        const url = `/shops/${shopIdentifier}/destinations/${destinationId}/sync`;
        const config: AxiosRequestConfig = {
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };

        try {
            await this.makeRequest(config);
        } catch (error) {
            throw new Error(`Error triggering destination sync: ${error}`);
        }
    }
}

export default BoldPlatformConnectorClient;
