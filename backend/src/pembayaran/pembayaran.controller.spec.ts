import { Test, TestingModule } from '@nestjs/testing';
import { PembayaranController } from './pembayaran.controller';

describe('PembayaranController', () => {
  let controller: PembayaranController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PembayaranController],
    }).compile();

    controller = module.get<PembayaranController>(PembayaranController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
