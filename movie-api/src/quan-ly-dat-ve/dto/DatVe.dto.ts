import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DanhSachVeDto {
  @ApiProperty({
    example: 'G01',
    description: 'The seat ID (maGhe)',
    type: String,
  })
  @IsString()
  maGhe: string;

  @ApiProperty({
    example: '75000',
    description: 'The ticket price (giaVe)',
    type: String,
  })
  @IsString()
  giaVe: string;
}

export class DatVeDto {
  @ApiProperty({
    example: 'LC01',
    description: 'The schedule ID (maLichChieu)',
    type: String,
  })
  @IsString()
  maLichChieu: string;

  @ApiProperty({
    example: [{ maGhe: 'LC01', giaVe: '75000' }],
    description: 'List of seats being booked (danhSachVe)',
    type: [DanhSachVeDto],
  })
  @IsArray({ message: 'danhSachVe must be an array' })
  @ValidateNested({ each: true })
  @Type(() => DanhSachVeDto)
  danhSachVe: DanhSachVeDto[];
}
