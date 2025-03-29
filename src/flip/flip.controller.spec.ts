import { Test, TestingModule } from '@nestjs/testing';
import { FlipController } from './flip.controller';

describe('FlipController', () => {
  let controller: FlipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlipController],
    }).compile();

    controller = module.get<FlipController>(FlipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
