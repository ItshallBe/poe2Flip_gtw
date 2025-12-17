import axios from 'axios';
import { ONL_CONFIG } from '../config/config';

export class FlipMarketProxyService {
  static async fetchData(bizMethod: string, requesturl: string, body: any, count = 3) {
    const len = ONL_CONFIG.proxy_urls.length;
    const urlIdx = Math.floor(Math.random() * len);
    const url = ONL_CONFIG.proxy_urls[urlIdx];
    const payload = body;

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
          "requesturl": requesturl,
          bizMethod: bizMethod,
        },
      });
      return response.data;
    } catch (error) {
      if (count <= 0) {
        return {
          error: 'Failed to fetch market proxy data',
          details: error.message,
        };
      } else {
        return await this.fetchData(bizMethod, requesturl, body, count - 1);
      }
    }
  }
}
