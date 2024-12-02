import { Expose } from 'class-transformer';

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
  ngayKhoiChieu: string;

  @Expose()
  danhGia: number;

  @Expose()
  hot: boolean;

  @Expose()
  dangChieu: boolean;

  @Expose()
  sapChieu: boolean;
}
