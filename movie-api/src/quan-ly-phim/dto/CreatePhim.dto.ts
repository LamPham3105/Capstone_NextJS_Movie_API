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
  @IsNotEmpty()
  ngayKhoiChieu: string;

  @ApiProperty()
  @IsOptional()
  danhGia?: number;

  @ApiProperty()
  @IsOptional()
  hot?: boolean;

  @ApiProperty()
  @IsOptional()
  dangChieu?: boolean;

  @ApiProperty()
  @IsOptional()
  sapChieu?: boolean;
}

export class CreatePhimDtoWithFile extends CreatePhimDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  hinhAnh: string;
}
