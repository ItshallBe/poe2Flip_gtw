import { Controller, Post, Headers, Body } from '@nestjs/common';
import { FlipQueryCurrencyService } from '../services/flip-query-currency.service';
import { FlipOnlService } from '../services/flip-onl.service';
import { FlipMarketProxyService } from '../services/flip-market-proxy.service';

@Controller('flip')
export class FlipController {
  @Post('api')
  async handleFlip(@Headers('bizMethod') bizMethod: string, @Body() body: any) {
    switch (bizMethod) {
      case 'flip.query.currency':
        return await FlipQueryCurrencyService.fetchMarketData();
      case 'flip.query.historyEquipment':
      case 'flip.save.currency':
      case 'flip.get.history.currency':
        return await FlipOnlService.fetchData(bizMethod, body);
      case 'flip.proxy.fetch':
      case 'flip.proxy.search':
      case 'flip.proxy.search.Standard':
        return await FlipMarketProxyService.fetchData(bizMethod, body);
      default:
        return { message: 'Unknown bizMethod' };
    }
  }
}
