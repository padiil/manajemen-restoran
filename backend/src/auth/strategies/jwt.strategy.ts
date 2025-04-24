import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { KaryawanService } from '../../karyawan/karyawan.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly karyawanService: KaryawanService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'), // Ambil secret key dari environment
        });
    }

    async validate(payload: any) {
        // Cari user berdasarkan ID dari payload JWT
        const user = await this.karyawanService.findOne(payload.sub); // Menggunakan findOne
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Kembalikan data user tanpa password
        const { password, ...result } = user;
        return result; // `req.user` akan berisi data user, termasuk `jabatan`
    }
}