import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const authServiceMock = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  } satisfies Partial<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate registration to AuthService', async () => {
    const dto = { email: 'email@test.com', password: 'pass', nama: 'Test', jabatan: 'KOKI' } as any;
    const expected = { token: 'abc' };
    authService.register = jest.fn().mockResolvedValue(expected);

    await expect(controller.register(dto)).resolves.toEqual(expected);
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('should login when credentials are valid', async () => {
    const dto = { email: 'email@test.com', password: 'secret' };
    const user = { id: 1, email: dto.email } as any;
    const expected = { access_token: 'token' } as any;
    authService.validateUser = jest.fn().mockResolvedValue(user);
    authService.login = jest.fn().mockResolvedValue(expected);

    await expect(controller.login(dto)).resolves.toEqual(expected);
    expect(authService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
    expect(authService.login).toHaveBeenCalledWith(user);
  });

  it('should throw UnauthorizedException when credentials are invalid', async () => {
    const dto = { email: 'nope@test.com', password: 'wrong' };
    authService.validateUser = jest.fn().mockResolvedValue(null);

    await expect(controller.login(dto)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(authService.login).not.toHaveBeenCalled();
  });
});
