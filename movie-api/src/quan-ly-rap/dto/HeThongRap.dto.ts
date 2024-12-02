import { Expose } from 'class-transformer';

export class HeThongRapDto {
  @Expose()
  maHeThongRap: string;

  @Expose()
  tenHeThongRap: string;

  @Expose()
  logo: string;
}
