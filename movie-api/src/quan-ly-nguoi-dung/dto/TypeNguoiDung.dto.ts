import { Expose } from 'class-transformer';

export class TypeNguoiDungDto {
  @Expose()
  maTypeNguoiDung: string;

  @Expose()
  tenTypeNguoiDung: number;
}
