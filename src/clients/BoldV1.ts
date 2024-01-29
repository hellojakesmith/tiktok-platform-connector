/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';
import { CHECKOUT_API_URL } from '../constants'

class Boldv1 {
    private axios: AxiosInstance;

    constructor(platform: string, store: string, token: string) {

        this.axios = axios.create({
            baseURL: `${CHECKOUT_API_URL}/api/v1/${platform}/${store}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Bold-Checkout-Access-Token': token,
            },
        });
    }

    async get(params: string) {
      let { data } = await this.axios.get(params);
        return data
    }

    async delete(params: string) {
      let { data } = await this.axios.delete(params);
        return data
    }

    async post(params: string, body: any) {
      let { data } = await this.axios.post(params, body);
        return data
    }

    async put(params: string, body: any) {
      let { data } = await this.axios.put(params, body);
        return data
    }

    async patch(params: string, body: any) {
      let { data } = await this.axios.patch(params, body);
        return data
    }
}

export default Boldv1;