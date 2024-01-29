import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';
import { BOLD_API_URL } from '../constants';

dotenv.config();

class BoldV2Client {
  private axios: AxiosInstance;
  public accessToken: string;

  constructor() {
    this.axios = axios.create({
      baseURL: BOLD_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    this.accessToken = ''; // Initialize the access token
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  async get(params: string) {
    try {
      const { data } = await this.axios.get(params, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return data;
    } catch (error) {
      console.error('Error making GET request:', error);
      throw error;
    }
  }

  async delete(params: string) {
    try {
      const { data } = await this.axios.delete(params, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return data;
    } catch (error) {
      console.error('Error making DELETE request:', error);
      throw error;
    }
  }

  async post(params: string, body: any) {
    try {
      const { data } = await this.axios.post(params, body, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return data;
    } catch (error) {
      console.error('Error making POST request:', error);
      throw error;
    }
  }

  async put(params: string, body: any) {
    try {
      const { data } = await this.axios.put(params, body, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return data;
    } catch (error) {
      console.error('Error making PUT request:', error);
      throw error;
    }
  }

  async patch(params: string, body: any) {
    try {
      const { data } = await this.axios.patch(params, body, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return data;
    } catch (error) {
      console.error('Error making PATCH request:', error);
      throw error;
    }
  }
}

export default BoldV2Client;
