import { Expose } from 'class-transformer';
import { TypeNguoiDung } from '../enum/TypeNguoiDung.enum';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NguoiDungDto {
  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Tài khoản người dùng',
    example: 123,
  })
  taiKhoan: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Tên người dùng',
    example: 'John Doe',
  })
  hoTen: string;

  @Expose()
  @IsEmail()
  @ApiProperty({
    description: 'Email người dùng',
    example: 'user123@example.com',
  })
  email: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Số điện thoại người dùng',
    example: 1234567890,
  })
  soDienThoai: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Mật khẩu người dùng',
    example: 'password123',
  })
  matKhau: string;

  @Expose()
  @IsOptional()
  @IsEnum(TypeNguoiDung)
  loaiNguoiDung: string;
}
