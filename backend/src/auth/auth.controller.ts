import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateKaryawanDto } from '../karyawan/dto/create-karyawan.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() createKaryawanDto: CreateKaryawanDto) {
        return this.authService.register(createKaryawanDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
}