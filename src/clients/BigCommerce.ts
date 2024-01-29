import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class BigCommerceClient {
  private httpClient: AxiosInstance;
  private accessToken: string;
  private storeHash: string;

  constructor() {
    this.accessToken = '';
    this.storeHash = '';
    this.httpClient = axios.create({
      baseURL: 'https://api.bigcommerce.com/stores',
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

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  setStoreHash(hash: string): void {
    this.storeHash = hash;
  }

  // Add other methods for making API requests to the BigCommerce API

}

export default BigCommerceClient;
