import { Test, TestingModule } from '@nestjs/testing';
import { KaryawanController } from './karyawan.controller';
import { KaryawanService } from './karyawan.service';

describe('KaryawanController', () => {
  let controller: KaryawanController;
  let service: KaryawanService;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } satisfies Partial<KaryawanService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KaryawanController],
      providers: [{ provide: KaryawanService, useValue: serviceMock }],
    }).compile();

    controller = module.get<KaryawanController>(KaryawanController);
    service = module.get<KaryawanService>(KaryawanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create new karyawan', async () => {
    const dto = { nama: 'Test' } as any;
    const created = { id: 1 } as any;
    service.create = jest.fn().mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all karyawan', async () => {
    const list = [{ id: 1 }] as any;
    service.findAll = jest.fn().mockResolvedValue(list);

    await expect(controller.findAll()).resolves.toEqual(list);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return karyawan by id', async () => {
    const entity = { id: 1 } as any;
    service.findOne = jest.fn().mockResolvedValue(entity);

    await expect(controller.findOne('1')).resolves.toEqual(entity);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update karyawan', async () => {
    const dto = { nama: 'Updated' } as any;
    const updated = { id: 1, nama: 'Updated' } as any;
    service.update = jest.fn().mockResolvedValue(updated);

    await expect(controller.update('1', dto)).resolves.toEqual(updated);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove karyawan', async () => {
    const removed = { id: 1 } as any;
    service.remove = jest.fn().mockResolvedValue(removed);

    await expect(controller.remove('1')).resolves.toEqual(removed);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
