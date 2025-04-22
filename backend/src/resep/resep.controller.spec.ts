import { Test, TestingModule } from '@nestjs/testing';
import { ResepController } from './resep.controller';

describe('ResepController', () => {
  let controller: ResepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResepController],
    }).compile();

    controller = module.get<ResepController>(ResepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
