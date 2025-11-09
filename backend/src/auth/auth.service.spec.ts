import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { KaryawanService } from '../karyawan/karyawan.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let karyawanService: KaryawanService;
  let jwtService: JwtService;

  const karyawanServiceMock = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  } satisfies Partial<KaryawanService>;

  const jwtServiceMock = {
    signAsync: jest.fn(),
  } satisfies Partial<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: KaryawanService, useValue: karyawanServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    karyawanService = module.get<KaryawanService>(KaryawanService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should hash password, create karyawan, and return login payload', async () => {
      const dto = { nama: 'John', email: 'john@test.com', password: 'secret', jabatan: 'KOKI' } as any;
      const hashedPassword = 'hashed-secret';
      const createdKaryawan = { id: 1, email: dto.email, jabatan: dto.jabatan, nama: dto.nama } as any;
      const expectedToken = 'jwt-token';

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
      karyawanService.create = jest.fn().mockResolvedValue(createdKaryawan);
      jwtService.signAsync = jest.fn().mockResolvedValue(expectedToken);

      const result = await service.register(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(karyawanService.create).toHaveBeenCalledWith({ ...dto, password: hashedPassword });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: createdKaryawan.id, email: dto.email, role: dto.jabatan });
      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: createdKaryawan.id,
          email: dto.email,
          jabatan: dto.jabatan,
          nama: dto.nama,
        },
      });
    });
  });

  describe('validateUser', () => {
    it('should return sanitized user when password is valid', async () => {
      const user = { id: 1, email: 'john@test.com', password: 'hashed', jabatan: 'KOKI' } as any;
      const sanitized = { id: 1, email: 'john@test.com', jabatan: 'KOKI' };

      karyawanService.findByEmail = jest.fn().mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      await expect(service.validateUser(user.email, 'secret')).resolves.toEqual(sanitized);
    });

    it('should return null when user is not found', async () => {
      karyawanService.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(service.validateUser('missing@test.com', 'pass')).resolves.toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password comparison fails', async () => {
      const user = { id: 1, email: 'john@test.com', password: 'hashed', jabatan: 'KOKI' } as any;

      karyawanService.findByEmail = jest.fn().mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.validateUser(user.email, 'wrong')).resolves.toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and sanitized user', async () => {
      const user = { id: 1, email: 'john@test.com', jabatan: 'KOKI', nama: 'John Doe' } as any;
      const token = 'token';

      jwtService.signAsync = jest.fn().mockResolvedValue(token);

      await expect(service.login(user)).resolves.toEqual({
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          jabatan: user.jabatan,
          nama: user.nama,
        },
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id, email: user.email, role: user.jabatan });
    });
  });
});
