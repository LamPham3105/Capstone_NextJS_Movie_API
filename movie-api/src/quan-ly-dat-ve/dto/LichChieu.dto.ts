import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCustomDate', async: false })
export class IsCustomDateConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
    return regex.test(value);
  }

  defaultMessage(): string {
    return 'Date must be in the format dd/MM/yyyy hh:mm:ss';
  }
}

@ValidatorConstraint({ name: 'isGiaVeRange', async: false })
export class IsGiaVeRangeConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const numericValue = parseFloat(value);
    return (
      !isNaN(numericValue) && numericValue >= 75000 && numericValue <= 200000
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Ticket price (giaVe) must be a numeric string between 75000 and 200000';
  }
}

export class LichChieuDto {
  @ApiProperty({
    description: 'The movie ID (maPhim)',
    example: 'P01',
  })
  @IsString()
  maPhim: string;

  @ApiProperty({
    description: 'The show date and time in format dd/MM/yyyy hh:mm:ss',
    example: '12/12/2021 12:12:21',
  })
  @Validate(IsCustomDateConstraint)
  ngayChieuGioChieu: string;

  @ApiProperty({
    description: 'The cinema hall ID (maRap)',
    example: 'R01',
  })
  @IsString()
  maRap: string;

  @ApiProperty({
    description: 'The ticket price (giaVe) as a string',
    example: '200000',
    minimum: 75000,
    maximum: 200000,
  })
  @IsString()
  @Validate(IsGiaVeRangeConstraint)
  giaVe: string;
}
