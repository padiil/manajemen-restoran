import { IsNotEmpty, IsNumber, IsOptional, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreatePesananDto {
  @IsNotEmpty()
  @IsNumber()
  waiterId: number;

  @IsOptional()
  @IsNumber()
  kokiId?: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}