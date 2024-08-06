import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';

export class CreatePaySubscriptionDto {
  @IsOptional()
  @IsBoolean()
  readonly isAnual?: boolean;

  @IsEmail()
  @IsNotEmpty()
  readonly payerEmail: string;

  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsDate()
  @IsNotEmpty()
  readonly paidDate: Date;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsNumber()
  @IsNotEmpty()
  readonly payId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly payment_method_id: string;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}
