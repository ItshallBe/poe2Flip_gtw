import { Controller, Post, Headers } from '@nestjs/common';
import { FlipQueryCurrencyService } from '../services/flip-query-currency.service';
import { FlipQueryHistoryEquipmentService } from '../services/flip-query-history-equipment.service';

@Controller('flip')
export class FlipController {
  @Post('api')
  async handleFlip(@Headers('bizMethod') bizMethod: string) {
    switch (bizMethod) {
      case 'flip.query.currency':
        return await FlipQueryCurrencyService.fetchMarketData();
      case 'flip.query.historyEquipment':
        return await FlipQueryHistoryEquipmentService.fetchHistoryData();
      default:
        return { message: 'Unknown bizMethod' };
    }
  }
}
