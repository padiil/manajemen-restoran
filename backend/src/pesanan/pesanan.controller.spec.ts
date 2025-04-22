import { Test, TestingModule } from '@nestjs/testing';
import { PesananController } from './pesanan.controller';

describe('PesananController', () => {
  let controller: PesananController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PesananController],
    }).compile();

    controller = module.get<PesananController>(PesananController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
