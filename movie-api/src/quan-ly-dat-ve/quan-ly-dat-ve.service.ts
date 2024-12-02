import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LichChieuResponseDTO } from '../quan-ly-dat-ve/dto/LichChieuResponse.dto';
import { format } from 'date-fns';
import { plainToClass } from 'class-transformer';
import { DatVeDto } from './dto/DatVe.dto';
import { LichChieuDto } from './dto/LichChieu.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class QuanLyDatVeService {
  prisma = new PrismaClient();

  async findLayDanhSachPhongVe(
    maLichChieu: string,
  ): Promise<LichChieuResponseDTO> {
    try {
      const lichChieu = await this.prisma.lichChieu.findFirst({
        where: { ma_lich_chieu: maLichChieu },
        include: {
          Phim: true,
          RapPhim: {
            include: {
              CumRap: true,
            },
          },
        },
      });

      if (!lichChieu) {
        return null;
      }

      const thongTinPhim = {
        maLichChieu: lichChieu.ma_lich_chieu,
        tenCumRap: lichChieu.RapPhim.CumRap.ten_cum_rap,
        tenRap: lichChieu.RapPhim.ten_rap,
        diaChi: lichChieu.RapPhim.CumRap.dia_chi,
        tenPhim: lichChieu.Phim.ten_phim,
        hinhAnh: lichChieu.Phim.hinh_anh,
        ngayChieu: format(new Date(lichChieu.ngay_gio_chieu), 'dd/MM/yyyy'),
        gioChieu: format(new Date(lichChieu.ngay_gio_chieu), 'HH:mm'),
      };

      const danhSachGhe = await this.prisma.ghe.findMany({
        where: { ma_rap: lichChieu.ma_rap },
        include: {
          DatVe: {
            where: { ma_lich_chieu: maLichChieu },
            include: { NguoiDung: true, LichChieu: true },
          },
        },
      });

      const danhSachGheDTO = danhSachGhe.map((ghe) => {
        const datVe = ghe.DatVe[0];
        return {
          maGhe: ghe.ma_ghe,
          tenGhe: ghe.ten_ghe,
          maRap: ghe.ma_rap,
          loaiGhe: ghe.loai_ghe,
          giaVe: datVe ? Number(datVe.LichChieu.gia_ve) : 0,
          daDat: !!datVe,
          taiKhoanNguoiDat: datVe?.NguoiDung?.ho_ten || null,
        };
      });

      const response = {
        thongTinPhim,
        danhSachGhe: danhSachGheDTO,
      };

      return plainToClass(LichChieuResponseDTO, response, {
        excludeExtraneousValues: true, // Ensures only `@Expose` properties are returned
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async datVe(tai_khoan: string, datVeDtos: DatVeDto[]) {
    const results = [];

    for (const datVeDto of datVeDtos) {
      const { maLichChieu, danhSachVe } = datVeDto;

      try {
        const lichChieu = await this.prisma.lichChieu.findUnique({
          where: { ma_lich_chieu: maLichChieu },
          include: { RapPhim: true },
        });

        if (!lichChieu) {
          throw new BadRequestException(
            `Lịch chiếu không hợp lệ: ${maLichChieu}`,
          );
        }

        const maRapFromLichChieu = lichChieu.ma_rap;

        for (const ve of danhSachVe) {
          const { maGhe } = ve;

          const ghe = await this.prisma.ghe.findUnique({
            where: { ma_ghe: maGhe },
          });

          if (!ghe) {
            throw new BadRequestException(`Ghế không hợp lệ: ${maGhe}`);
          }

          if (ghe.ma_rap !== maRapFromLichChieu) {
            throw new BadRequestException(
              `Ghế ${maGhe} không thuộc rạp của lịch chiếu: ${maRapFromLichChieu}`,
            );
          }

          const alreadyBooked = await this.prisma.datVe.findFirst({
            where: { ma_lich_chieu: maLichChieu, ma_ghe: maGhe },
          });

          if (alreadyBooked) {
            throw new BadRequestException(`Ghế ${maGhe} đã được đặt!`);
          }
        }

        const bookingPromises = danhSachVe.map((ve) =>
          this.prisma.datVe.create({
            data: {
              tai_khoan: tai_khoan,
              ma_lich_chieu: maLichChieu,
              ma_ghe: ve.maGhe,
            },
          }),
        );

        await Promise.all(bookingPromises);

        const tongTien = danhSachVe.reduce(
          (sum, ve) => sum + parseFloat(ve.giaVe),
          0,
        );

        results.push({
          maLichChieu,
          message: 'Đặt vé thành công!',
          tongTien,
        });
      } catch (error) {
        if (error instanceof BadRequestException) {
          results.push({
            maLichChieu,
            message: `Lỗi: ${error.message}`,
          });
        } else {
          throw new InternalServerErrorException(
            'An unexpected error occurred',
          );
        }
      }
    }

    return results;
  }

  async createLichChieu(lichChieuDto: LichChieuDto): Promise<LichChieuDto> {
    const { maPhim, ngayChieuGioChieu, maRap, giaVe } = lichChieuDto;

    try {
      const giaVeNumber = parseFloat(giaVe);
      if (isNaN(giaVeNumber) || giaVeNumber < 75000 || giaVeNumber > 200000) {
        throw new BadRequestException('Giá vé phải từ 75,000 đến 200,000');
      }

      const phim = await this.prisma.phim.findUnique({
        where: { ma_phim: maPhim },
      });
      if (!phim) {
        throw new BadRequestException('Movie with the given ID does not exist');
      }

      const rap = await this.prisma.rapPhim.findUnique({
        where: { ma_rap: maRap },
      });
      if (!rap) {
        throw new BadRequestException(
          'Cinema hall with the given ID does not exist',
        );
      }

      const date = new Date(ngayChieuGioChieu);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      const existingLichChieu = await this.prisma.lichChieu.findFirst({
        where: {
          ma_phim: maPhim,
          ma_rap: maRap,
          ngay_gio_chieu: date,
        },
      });
      if (existingLichChieu) {
        throw new BadRequestException('Lịch chiếu đã tồn tại!');
      }

      const createdLichChieu = await this.prisma.lichChieu.create({
        data: {
          ma_lich_chieu: '',
          ma_phim: maPhim,
          ngay_gio_chieu: date,
          ma_rap: maRap,
          gia_ve: giaVeNumber.toString(),
        },
      });

      return plainToClass(LichChieuDto, createdLichChieu);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error creating LichChieu',
      );
    }
  }
}
