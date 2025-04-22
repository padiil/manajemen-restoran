import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;
}