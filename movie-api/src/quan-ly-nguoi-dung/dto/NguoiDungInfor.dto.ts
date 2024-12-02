import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsArray,
  IsObject,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class LoaiNguoiDungDto {
  @IsString()
  maLoaiNguoiDung: string;

  @IsString()
  tenLoai: string;
}

class GheDto {
  @IsString()
  maHeThongRap: string;

  @IsString()
  tenHeThongRap: string;

  @IsString()
  maCumRap: string;

  @IsString()
  tenCumRap: string;

  @IsNumber()
  maRap: number;

  @IsString()
  tenRap: string;

  @IsString()
  maGhe: string;

  @IsString()
  tenGhe: string;
}

class ThongTinDatVeDto {
  @IsArray()
  @Type(() => GheDto)
  danhSachGhe: GheDto[];

  @IsString()
  maVe: string;

  @IsString()
  ngayDat: string;

  @IsString()
  tenPhim: string;

  @IsString()
  hinhAnh: string;

  @IsString()
  giaVe: string;
}

export class NguoiDungInforDto {
  @IsString()
  @IsNotEmpty()
  taiKhoan: string;

  @IsString()
  @IsNotEmpty()
  matKhau: string;

  @IsString()
  hoTen: string;

  @IsEmail()
  email: string;

  @IsString()
  soDT: string;

  @IsString()
  maLoaiNguoiDung: string;

  @IsObject()
  @Type(() => LoaiNguoiDungDto)
  loaiNguoiDung: LoaiNguoiDungDto;

  @IsArray()
  @Type(() => ThongTinDatVeDto)
  thongTinDatVe: ThongTinDatVeDto[];
}
