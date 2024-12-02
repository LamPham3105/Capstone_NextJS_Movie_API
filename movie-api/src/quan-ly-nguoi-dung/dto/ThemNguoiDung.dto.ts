import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeNguoiDung } from '../enum/TypeNguoiDung.enum';
import { TypeNguoiDungDto } from './TypeNguoiDung.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ThemNguoiDungDto {
  @ApiProperty({
    description: 'The account username',
    example: 'user1',
  })
  @IsString()
  @IsNotEmpty()
  taiKhoan: string;

  @ApiProperty({
    description: 'The user password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  matKhau: string;

  @ApiProperty({
    description: 'The user email address',
    example: 'user1@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The user phone number',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  soDt: string;

  @ApiProperty({
    description: 'The type of user (e.g., customer or admin)',
    enum: TypeNguoiDung,
    example: 'QuanTri',
  })
  @IsEnum(TypeNguoiDung)
  maLoaiNguoiDung: TypeNguoiDung;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  hoTen: string;
}
