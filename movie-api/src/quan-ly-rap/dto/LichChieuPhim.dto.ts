import { Exclude, Expose } from 'class-transformer';

export class PhimDto {
  @Expose()
  maPhim: string;

  @Expose()
  tenPhim: string;

  @Expose()
  trailer: string;

  @Expose()
  hinhAnh: string;

  @Expose()
  moTa: string;

  @Expose()
  hot: boolean;

  @Expose()
  dangChieu: boolean;

  @Expose()
  sapChieu: boolean;

  @Expose()
  ngayKhoiChieu: string;

  @Expose()
  danhGia: number;

  @Expose()
  heThongRapChieu: HeThongRapDto[];
}

export class HeThongRapDto {
  @Expose()
  maHeThongRap: string;

  @Expose()
  tenHeThongRap: string;

  @Expose()
  logo: string;

  @Expose()
  cumRapChieu: CumRapDto[];
}

export class CumRapDto {
  @Expose()
  maCumRap: string;

  @Expose()
  tenCumRap: string;

  @Expose()
  hinhAnh: string;

  @Expose()
  diaChi: string;

  @Expose()
  lichChieuPhim: LichChieuPhimDto[];
}

export class LichChieuPhimDto {
  @Expose()
  maLichChieu: string;

  @Expose()
  maRap: string;

  @Expose()
  tenRap: string;

  @Expose()
  ngayChieuGioChieu: string;

  @Expose()
  giaVe: string;

  @Expose()
  thoiLuong: number;
}
