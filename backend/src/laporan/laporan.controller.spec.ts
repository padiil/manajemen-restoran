import { Test, TestingModule } from '@nestjs/testing';
import { LaporanController } from './laporan.controller';

describe('LaporanController', () => {
  let controller: LaporanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaporanController],
    }).compile();

    controller = module.get<LaporanController>(LaporanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
