import { Exclude, Expose } from 'class-transformer';

export class LichChieuHeThongRapDto {
  @Expose()
  maHeThongRap: string;

  @Expose()
  tenHeThongRap: string;

  @Expose()
  logo: string;

  @Expose()
  lstCumRap: CumRapDto[];
}

export class CumRapDto {
  @Expose()
  maCumRap: number;

  @Expose()
  tenCumRap: string;

  @Expose()
  diaChi: string;

  @Expose()
  danhSachPhim: PhimDto[];
}

export class PhimDto {
  @Expose()
  maPhim: number;

  @Expose()
  tenPhim: string;

  @Expose()
  hinhAnh: string;

  @Expose()
  hot: boolean;

  @Expose()
  dangChieu: boolean;

  @Expose()
  sapChieu: boolean;

  @Expose()
  lstLichChieuTheoPhim: LichChieuDto[];
}

export class RapDto {
  @Expose()
  maRap: number;

  @Expose()
  tenRap: string;
}

export class LichChieuDto {
  @Expose()
  maLichChieu: string;

  @Expose()
  rap: RapDto;

  @Expose()
  ngayChieuGioChieu: string;

  @Expose()
  giaVe: string;
}
