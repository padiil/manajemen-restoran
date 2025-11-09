import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  const appServiceMock = {
    getHello: jest.fn().mockReturnValue('Hello World!'),
  } satisfies Partial<AppService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appServiceMock }],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should delegate to AppService when getting greeting', () => {
    const result = controller.getHello();

    expect(service.getHello).toHaveBeenCalledTimes(1);
    expect(result).toEqual('Hello World!');
  });
});
