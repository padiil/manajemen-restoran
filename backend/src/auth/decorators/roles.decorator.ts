import { SetMetadata } from '@nestjs/common';
import { Jabatan } from '@prisma/client';

export const Roles = (...roles: Jabatan[]) => SetMetadata('roles', roles);