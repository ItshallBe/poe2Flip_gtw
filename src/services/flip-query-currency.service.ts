import axios from 'axios';

export class FlipQueryCurrencyService {
  static async fetchMarketData(body: any) {
    const { type, league, ver } = body;
    let url = '';
    if (ver === 'poe1') {
      url = `https://poe.ninja/api/data/currencyoverview?league=${league}&type=${type}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
        },
      });
      return response.data;
    } catch (error) {
      return { error: 'Failed to fetch market data', details: error.message };
    }
  }
}
