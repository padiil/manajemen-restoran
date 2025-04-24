import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { KaryawanService } from '../karyawan/karyawan.service';
import { CreateKaryawanDto } from '../karyawan/dto/create-karyawan.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly karyawanService: KaryawanService,
        private readonly jwtService: JwtService,
    ) { }

    async register(createKaryawanDto: CreateKaryawanDto): Promise<any> {
        // Implementasi logika pendaftaran karyawan (jika diperlukan)
        // Pastikan untuk mengenkripsi password sebelum menyimpan
        const hashedPassword = await bcrypt.hash(createKaryawanDto.password, 10);
        const karyawan = await this.karyawanService.create({ ...createKaryawanDto, password: hashedPassword });
        return this.login(karyawan);
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const karyawan = await this.karyawanService.findByEmail(email);
        if (karyawan && karyawan.password) {
            const isPasswordValid = await bcrypt.compare(pass, karyawan.password);
            if (isPasswordValid) {
                const { password, ...result } = karyawan;
                return result; // Jangan kembalikan password
            }
        }
        return null;
    }

    async login(user: any): Promise<{ access_token: string; user: any }> {
        const payload = { sub: user.id, email: user.email, role: user.jabatan };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                jabatan: user.jabatan,
                nama: user.nama,
            },
        };
    }
}