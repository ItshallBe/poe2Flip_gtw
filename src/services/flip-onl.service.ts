import axios from 'axios';
import { ONL_CONFIG } from '../config/config';

export class FlipOnlService {
  static async fetchData(bizMethod: string, body: any) {
    const url = ONL_CONFIG.url + ONL_CONFIG[bizMethod];
    const payload = body;

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return { error: 'Failed to fetch onl data', details: error.message };
    }
  }
}
