import { Expose, Type } from 'class-transformer';

// DTO for movie information
export class ThongTinPhimDto {
  @Expose()
  maLichChieu: string;

  @Expose()
  tenCumRap: string;

  @Expose()
  tenRap: string;

  @Expose()
  diaChi: string;

  @Expose()
  tenPhim: string;

  @Expose()
  hinhAnh: string;

  @Expose()
  ngayChieu: string;

  @Expose()
  gioChieu: string;
}

// DTO for seat details
export class DanhSachGheDto {
  @Expose()
  maGhe: string;

  @Expose()
  tenGhe: string;

  @Expose()
  maRap: string;

  @Expose()
  loaiGhe: string;

  @Expose()
  giaVe: string;

  @Expose()
  daDat: boolean;

  @Expose()
  taiKhoanNguoiDat: string | null;
}

export class LichChieuResponseDTO {
  @Expose()
  @Type(() => ThongTinPhimDto)
  thongTinPhim: ThongTinPhimDto;

  @Expose()
  @Type(() => DanhSachGheDto)
  danhSachGhe: DanhSachGheDto[];
}
