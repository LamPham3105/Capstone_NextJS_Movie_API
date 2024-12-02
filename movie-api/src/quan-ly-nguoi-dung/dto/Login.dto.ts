import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TypeNguoiDung } from '../enum/TypeNguoiDung.enum';

export class LoginDto {
  @IsString()
  @ApiProperty()
  taiKhoan: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @ApiProperty()
  matKhau: string;
}

export class NguoiDungLoginDto {
  @Expose()
  taiKhoan: string;

  @Expose()
  hoTen: string;

  @Expose()
  email: string;

  @Expose()
  soDienThoai: string;

  @Expose()
  @IsOptional()
  @IsEnum(TypeNguoiDung)
  loaiNguoiDung: string;

  accessToken: string;
}
