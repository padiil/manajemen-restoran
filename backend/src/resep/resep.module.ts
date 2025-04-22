import { Module } from '@nestjs/common';
import { ResepController } from './resep.controller';
import { ResepService } from './resep.service';

@Module({
  controllers: [ResepController],
  providers: [ResepService]
})
export class ResepModule {}
