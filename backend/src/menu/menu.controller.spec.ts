import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

describe('MenuController', () => {
  let controller: MenuController;
  let service: MenuService;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } satisfies Partial<MenuService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [{ provide: MenuService, useValue: serviceMock }],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    service = module.get<MenuService>(MenuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create menu item', async () => {
    const dto = { nama: 'Nasi Goreng' } as any;
    const created = { id: 'm1' } as any;
    service.create = jest.fn().mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all menu items', async () => {
    const list = [{ id: 'm1' }] as any;
    service.findAll = jest.fn().mockResolvedValue(list);

    await expect(controller.findAll()).resolves.toEqual(list);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return menu by id', async () => {
    const entity = { id: 'm1' } as any;
    service.findOne = jest.fn().mockResolvedValue(entity);

    await expect(controller.findOne('m1')).resolves.toEqual(entity);
    expect(service.findOne).toHaveBeenCalledWith('m1');
  });

  it('should update menu item', async () => {
    const dto = { harga: 10000 } as any;
    const updated = { id: 'm1', harga: 10000 } as any;
    service.update = jest.fn().mockResolvedValue(updated);

    await expect(controller.update('m1', dto)).resolves.toEqual(updated);
    expect(service.update).toHaveBeenCalledWith('m1', dto);
  });

  it('should remove menu item', async () => {
    const removed = { id: 'm1' } as any;
    service.remove = jest.fn().mockResolvedValue(removed);

    await expect(controller.remove('m1')).resolves.toEqual(removed);
    expect(service.remove).toHaveBeenCalledWith('m1');
  });
});
