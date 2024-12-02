import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BannerDto } from './dto/banner.dto';
import { plainToClass } from 'class-transformer';
import { PhimDto } from './dto/Phim.dto';
import { isValidDate } from '../ulti';
import { CreatePhimDto } from './dto/CreatePhim.dto';

@Injectable()
export class QuanLyPhimService {
  prisma = new PrismaClient();

  async findLayDanhSachBanner(): Promise<BannerDto[]> {
    try {
      let result = await this.prisma.banner.findMany();

      return result.map((banner) => plainToClass(BannerDto, banner));
    } catch (error) {
      throw new Error(error);
    }
  }

  async findLayDanhSachPhim(tenPhim: string): Promise<PhimDto[]> {
    try {
      let result = await this.prisma.phim.findMany({
        where: tenPhim
          ? {
              ten_phim: {
                contains: tenPhim,
              },
            }
          : {},
      });

      if (!result || result.length <= 0) return [];

      return result.map((phim) => plainToClass(PhimDto, phim));
    } catch (error) {
      throw new Error(error);
    }
  }

  async findLayDanhSachPhimPhanTrang(
    page: number,
    size: number,
    tenPhim: string,
  ): Promise<PhimDto[]> {
    try {
      let result = await this.prisma.phim.findMany({
        where: tenPhim
          ? {
              ten_phim: {
                contains: tenPhim,
              },
            }
          : {},
        skip: (page - 1) * size,
        take: size,
      });

      if (!result || result.length <= 0) return [];

      return result.map((phim) => plainToClass(PhimDto, phim));
    } catch (error) {
      throw new Error(error);
    }
  }

  async findLayDanhSachPhimTheoNgay(
    page: number,
    size: number,
    tenPhim: string,
    startDate: string,
    endDate: string,
  ): Promise<PhimDto[]> {
    try {
      let whereClause: any = {
        ...(tenPhim
          ? {
              ten_phim: {
                contains: tenPhim,
              },
            }
          : {}),
      };

      if (startDate && isValidDate(startDate)) {
        whereClause.ngay_khoi_chieu = {
          ...whereClause.ngay_khoi_chieu,
          gte: new Date(startDate),
        };
      } else {
        return [];
      }

      if (endDate && isValidDate(endDate)) {
        whereClause.ngay_khoi_chieu = {
          ...whereClause.ngay_khoi_chieu,
          lte: new Date(endDate),
        };
      } else {
        return [];
      }

      let result = await this.prisma.phim.findMany({
        where: whereClause,
        skip: (page - 1) * size,
        take: size,
      });

      if (!result || result.length <= 0) return [];

      return result.map((phim) => plainToClass(PhimDto, phim));
    } catch (error) {
      throw new Error(error);
    }
  }

  async findLayThongTinPhim(maPhim: string): Promise<PhimDto> {
    try {
      let result = await this.prisma.phim.findFirst({
        where: maPhim
          ? {
              ma_phim: maPhim,
            }
          : {},
      });

      if (!result) return null;

      return plainToClass(PhimDto, result);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createPhim(createPhimDto: CreatePhimDto): Promise<CreatePhimDto> {
    try {
      const movie = await this.prisma.phim.create({
        data: {
          ma_phim: '',
          ten_phim: createPhimDto.tenPhim,
          trailer: createPhimDto.trailer,
          hinh_anh: createPhimDto.hinhAnh,
          mo_ta: createPhimDto.moTa,
          ngay_khoi_chieu: new Date(createPhimDto.ngayKhoiChieu),
          danh_gia: createPhimDto.danhGia,
          hot: createPhimDto.hot,
          dang_chieu: createPhimDto.dangChieu,
          sap_chieu: createPhimDto.sapChieu,
        },
      });

      return plainToClass(CreatePhimDto, movie);
    } catch (error) {
      throw new BadRequestException('Error creating movie: ' + error.message);
    }
  }

  async deletePhim(maPhim: string): Promise<void> {
    try {
      const phim = await this.prisma.phim.findFirst({
        where: maPhim ? { ma_phim: maPhim } : {},
      });

      if (!phim) {
        throw new NotFoundException(
          `Movie with account ID ${maPhim} not found`,
        );
      }

      // Delete the movie
      await this.prisma.phim.deleteMany({ where: { ma_phim: maPhim } });
    } catch (error) {
      throw error;
    }
  }
}
