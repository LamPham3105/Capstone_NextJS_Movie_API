import { Exclude, Expose } from 'class-transformer';

export class CumRapDto {
  @Expose()
  maCumRap: string;

  @Expose()
  tenCumRap: string;

  @Expose()
  diaChi: string;

  @Exclude()
  danhSachRap: RapPhimDto[];
}

export class RapPhimDto {
  @Expose()
  maRap: string;

  @Expose()
  tenRap: string;

  @Exclude()
  maCumRap: number;
}
