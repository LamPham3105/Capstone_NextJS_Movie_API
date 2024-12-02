import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePhimDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenPhim: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  trailer?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  hinhAnh?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  moTa?: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  ngayKhoiChieu: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  danhGia?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hot?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  dangChieu?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  sapChieu?: boolean;
}

export class CreatePhimDtoWithFile extends CreatePhimDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  hinhAnh: string;
}
