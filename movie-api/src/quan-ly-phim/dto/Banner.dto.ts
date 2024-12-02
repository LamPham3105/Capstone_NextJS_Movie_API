import { Expose } from 'class-transformer';

export class BannerDto {
  @Expose()
  maBanner: string;

  @Expose()
  maPhim: string;

  @Expose()
  hinhAnh: string;
}
