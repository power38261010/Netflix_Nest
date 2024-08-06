import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreatePayDto {
  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  monthlyPayment: number;

  @IsOptional()
  @IsInt()
  subscriptionId?: number;
}
