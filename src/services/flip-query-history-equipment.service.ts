import axios from 'axios';

export class FlipQueryHistoryEquipmentService {
  static async fetchHistoryData() {
    const url = 'http://47.117.46.26:3000/tradeHistory/search';
    const payload = {
      date: '20250316',
      baseType: '[Jewel]',
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return { error: 'Failed to fetch history data', details: error.message };
    }
  }
}
