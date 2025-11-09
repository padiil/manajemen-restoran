import { Test, TestingModule } from '@nestjs/testing';
import { ResepController } from './resep.controller';
import { ResepService } from './resep.service';

describe('ResepController', () => {
  let controller: ResepController;
  let service: ResepService;

  const serviceMock = {
    createBulk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByProdukId: jest.fn(),
    findByBahanId: jest.fn(),
  } satisfies Partial<ResepService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResepController],
      providers: [{ provide: ResepService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ResepController>(ResepController);
    service = module.get<ResepService>(ResepService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create bulk resep', async () => {
    const dto = { resep: [{ idProduk: 'p1' }] } as any;
    const created = [{ id: 'r1' }];
    service.createBulk = jest.fn().mockResolvedValue(created);

    await expect(controller.createBulk(dto)).resolves.toEqual(created);
    expect(service.createBulk).toHaveBeenCalledWith(dto.resep);
  });

  it('should create resep', async () => {
    const dto = { idProduk: 'p1' } as any;
    const created = { id: 'r1' } as any;
    service.create = jest.fn().mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all resep', async () => {
    const list = [{ id: 'r1' }] as any;
    service.findAll = jest.fn().mockResolvedValue(list);

    await expect(controller.findAll()).resolves.toEqual(list);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return resep by id', async () => {
    const entity = { id: 'r1' } as any;
    service.findOne = jest.fn().mockResolvedValue(entity);

    await expect(controller.findOne('r1')).resolves.toEqual(entity);
    expect(service.findOne).toHaveBeenCalledWith('r1');
  });

  it('should update resep', async () => {
    const dto = { kuantitas: 2 } as any;
    const updated = { id: 'r1', kuantitas: 2 } as any;
    service.update = jest.fn().mockResolvedValue(updated);

    await expect(controller.update('r1', dto)).resolves.toEqual(updated);
    expect(service.update).toHaveBeenCalledWith('r1', dto);
  });

  it('should remove resep', async () => {
    const removed = { id: 'r1' } as any;
    service.remove = jest.fn().mockResolvedValue(removed);

    await expect(controller.remove('r1')).resolves.toEqual(removed);
    expect(service.remove).toHaveBeenCalledWith('r1');
  });

  it('should find resep by produk id', async () => {
    const list = [{ id: 'r1' }] as any;
    service.findByProdukId = jest.fn().mockResolvedValue(list);

    await expect(controller.findByProdukId('p1')).resolves.toEqual(list);
    expect(service.findByProdukId).toHaveBeenCalledWith('p1');
  });

  it('should find resep by bahan id', async () => {
    const list = [{ id: 'r1' }] as any;
    service.findByBahanId = jest.fn().mockResolvedValue(list);

    await expect(controller.findByBahanId('10')).resolves.toEqual(list);
    expect(service.findByBahanId).toHaveBeenCalledWith(10);
  });
});
