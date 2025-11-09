import { Test, TestingModule } from '@nestjs/testing';
import { PembayaranController } from './pembayaran.controller';
import { PembayaranService } from './pembayaran.service';

describe('PembayaranController', () => {
  let controller: PembayaranController;
  let service: PembayaranService;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPesananId: jest.fn(),
    remove: jest.fn(),
  } satisfies Partial<PembayaranService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PembayaranController],
      providers: [{ provide: PembayaranService, useValue: serviceMock }],
    }).compile();

    controller = module.get<PembayaranController>(PembayaranController);
    service = module.get<PembayaranService>(PembayaranService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create pembayaran', async () => {
    const dto = { idPesanan: 'o1' } as any;
    const created = { id: 'pay1' } as any;
    service.create = jest.fn().mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all pembayaran', async () => {
    const list = [{ id: 'pay1' }] as any;
    service.findAll = jest.fn().mockResolvedValue(list);

    await expect(controller.findAll()).resolves.toEqual(list);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return pembayaran by id', async () => {
    const entity = { id: 'pay1' } as any;
    service.findOne = jest.fn().mockResolvedValue(entity);

    await expect(controller.findOne('pay1')).resolves.toEqual(entity);
    expect(service.findOne).toHaveBeenCalledWith('pay1');
  });

  it('should return pembayaran by pesanan id', async () => {
    const entity = { id: 'pay1' } as any;
    service.findByPesananId = jest.fn().mockResolvedValue(entity);

    await expect(controller.findByPesananId('order-1')).resolves.toEqual(entity);
    expect(service.findByPesananId).toHaveBeenCalledWith('order-1');
  });

  it('should remove pembayaran', async () => {
    const removed = { id: 'pay1' } as any;
    service.remove = jest.fn().mockResolvedValue(removed);

    await expect(controller.remove('pay1')).resolves.toEqual(removed);
    expect(service.remove).toHaveBeenCalledWith('pay1');
  });
});
