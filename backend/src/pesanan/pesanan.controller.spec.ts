import { Test, TestingModule } from '@nestjs/testing';
import { PesananController } from './pesanan.controller';
import { PesananService } from './pesanan.service';

describe('PesananController', () => {
  let controller: PesananController;
  let service: PesananService;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } satisfies Partial<PesananService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PesananController],
      providers: [{ provide: PesananService, useValue: serviceMock }],
    }).compile();

    controller = module.get<PesananController>(PesananController);
    service = module.get<PesananService>(PesananService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create pesanan', async () => {
    const dto = { waiterId: 1 } as any;
    const created = { id: 'order-1' } as any;
    service.create = jest.fn().mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should retrieve all pesanan', async () => {
    const list = [{ id: 'order-1' }] as any;
    service.findAll = jest.fn().mockResolvedValue(list);

    await expect(controller.findAll()).resolves.toEqual(list);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should retrieve a pesanan by id', async () => {
    const entity = { id: 'order-1' } as any;
    service.findOne = jest.fn().mockResolvedValue(entity);

    await expect(controller.findOne('order-1')).resolves.toEqual(entity);
    expect(service.findOne).toHaveBeenCalledWith('order-1');
  });

  it('should update a pesanan', async () => {
    const dto = { status: 'SELESAI' } as any;
    const updated = { id: 'order-1', status: 'SELESAI' } as any;
    service.update = jest.fn().mockResolvedValue(updated);

    await expect(controller.update('order-1', dto)).resolves.toEqual(updated);
    expect(service.update).toHaveBeenCalledWith('order-1', dto);
  });

  it('should remove a pesanan', async () => {
    const removed = { id: 'order-1' } as any;
    service.remove = jest.fn().mockResolvedValue(removed);

    await expect(controller.remove('order-1')).resolves.toEqual(removed);
    expect(service.remove).toHaveBeenCalledWith('order-1');
  });
});
