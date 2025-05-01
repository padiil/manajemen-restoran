import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResepDto } from './create-resep.dto';

export class CreateResepArrayDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateResepDto)
    resep: CreateResepDto[];
}