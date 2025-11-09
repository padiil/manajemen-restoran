import { Test, TestingModule } from '@nestjs/testing';
import { StokController } from './stok.controller';
import { StokService } from './stok.service';

describe('StokController', () => {
  let controller: StokController;
  let service: StokService;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } satisfies Partial<StokService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StokController],
      providers: [{ provide: StokService, useValue: serviceMock }],
    }).compile();

    controller = module.get<StokController>(StokController);
    service = module.get<StokService>(StokService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create stok', async () => {
    const dto = { namaBahan: 'Tepung' } as any;
    const created = { id: 1 } as any;
    service.create = jest.fn().mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all stok', async () => {
    const list = [{ id: 1 }] as any;
    service.findAll = jest.fn().mockResolvedValue(list);

    await expect(controller.findAll()).resolves.toEqual(list);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return stok by id', async () => {
    const entity = { id: 1 } as any;
    service.findOne = jest.fn().mockResolvedValue(entity);

    await expect(controller.findOne('1')).resolves.toEqual(entity);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update stok', async () => {
    const dto = { jumlah: 10 } as any;
    const updated = { id: 1, jumlah: 10 } as any;
    service.update = jest.fn().mockResolvedValue(updated);

    await expect(controller.update('1', dto)).resolves.toEqual(updated);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove stok', async () => {
    const removed = { id: 1 } as any;
    service.remove = jest.fn().mockResolvedValue(removed);

    await expect(controller.remove('1')).resolves.toEqual(removed);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
