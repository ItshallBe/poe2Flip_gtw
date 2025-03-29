import axios from 'axios';

export class FlipQueryCurrencyService {
  static async fetchMarketData() {
    const url =
      'https://orbwatch.trade/api/currency/market-data?mode=buy&realm=Standard';

    try {
      const response = await axios.get(url, {
        headers: {
          Referer: 'https://orbwatch.trade/',
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
