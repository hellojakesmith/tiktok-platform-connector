/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';

class FetchApi {
  private axios: AxiosInstance;
 
  constructor(url: string) {
  
    this.axios = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async get(params: string) {
    let { data } = await this.axios.get(params);
    return data;
  }

  async delete(params: string) {
    let { data } = await this.axios.delete(params);
    return data;
  }

  async post(params: string, body: any) {
    let { data } = await this.axios.post(params, body);
    return data;
  }

  async put(params: string, body: any) {
    let { data } = await this.axios.put(params, body);
    return data;
  }

  async patch(params: string, body: any) {
    let { data } = await this.axios.patch(params, body);
    return data;
  }
}

export default FetchApi;