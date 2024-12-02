import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { HeThongRapDto } from './dto/HeThongRap.dto';
import { plainToClass } from 'class-transformer';
import { CumRapDto } from './dto/CumRap.dto';
import { LichChieuHeThongRapDto } from './dto/LichChieuHeThongRap.dto';
import { PhimDto } from './dto/LichChieuPhim.dto';

@Injectable()
export class QuanLyRapService {
  prisma = new PrismaClient();

  async findLayThongTinHeThongRap(
    maHeThongRap: string,
  ): Promise<HeThongRapDto[]> {
    try {
      let heThongRaps = await this.prisma.heThongRap.findMany({
        where: maHeThongRap
          ? {
              ma_he_thong_rap: maHeThongRap,
            }
          : {},
      });

      return heThongRaps.map((heThongRap) =>
        plainToClass(HeThongRapDto, heThongRap),
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async findLayThongTinCumRapTheoHeThong(
    maHeThongRap: string,
  ): Promise<CumRapDto[]> {
    try {
      const heThongRap = await this.prisma.heThongRap.findFirst({
        where: {
          ma_he_thong_rap: maHeThongRap,
        },
        include: {
          CumRap: {
            select: {
              ma_cum_rap: true,
              ten_cum_rap: true,
              dia_chi: true,
              RapPhim: {
                select: {
                  ma_rap: true,
                  ten_rap: true,
                },
              },
            },
          },
        },
      });

      return heThongRap?.CumRap.map((cumRap) =>
        plainToClass(CumRapDto, {
          maCumRap: cumRap.ma_cum_rap,
          tenCumRap: cumRap.ten_cum_rap,
          diaChi: cumRap.dia_chi,
          danhSachRap: cumRap.RapPhim.map((rap) => ({
            maRap: rap.ma_rap,
            tenRap: rap.ten_rap,
          })),
        }),
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async findLayThongTinLichChieuHeThongRap(
    maHeThongRap: string,
  ): Promise<LichChieuHeThongRapDto[]> {
    try {
      const results = await this.prisma.heThongRap.findMany({
        where: maHeThongRap
          ? {
              ma_he_thong_rap: maHeThongRap,
            }
          : {},
        include: {
          CumRap: {
            include: {
              RapPhim: {
                include: {
                  LichChieu: {
                    include: {
                      Phim: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!results || results.length === 0) {
        return [];
      }

      const lichChieuPhimDtos = results.map((heThongRap) => {
        return plainToClass(LichChieuHeThongRapDto, {
          maHeThongRap: heThongRap.ma_he_thong_rap,
          tenHeThongRap: heThongRap.ten_he_thong_rap,
          logo: heThongRap.logo,
          lstCumRap: heThongRap.CumRap.map((cumRap) => {
            return {
              maCumRap: cumRap.ma_cum_rap,
              tenCumRap: cumRap.ten_cum_rap,
              diaChi: cumRap.dia_chi,
              danhSachPhim: cumRap.RapPhim.map((rapPhim) => {
                return rapPhim.LichChieu.map((lichChieu) => {
                  return {
                    maPhim: lichChieu.Phim.ma_phim,
                    tenPhim: lichChieu.Phim.ten_phim,
                    hinhAnh: lichChieu.Phim.hinh_anh,
                    hot: lichChieu.Phim.hot,
                    dangChieu: lichChieu.Phim.dang_chieu,
                    sapChieu: lichChieu.Phim.sap_chieu,
                    lstLichChieuTheoPhim: [
                      {
                        maLichChieu: lichChieu.ma_lich_chieu,
                        maRap: lichChieu.ma_rap,
                        tenRap: rapPhim.ten_rap,
                        ngayChieuGioChieu: lichChieu.ngay_gio_chieu,
                        giaVe: Number(lichChieu.gia_ve),
                      },
                    ],
                  };
                });
              }).flat(),
            };
          }),
        });
      });

      return lichChieuPhimDtos;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findLayThongTinLichChieuPhim(maPhim: string): Promise<PhimDto> {
    try {
      const result = await this.prisma.phim.findFirst({
        where: maPhim
          ? {
              ma_phim: maPhim,
            }
          : {},
        include: {
          LichChieu: {
            include: {
              RapPhim: {
                include: {
                  CumRap: {
                    include: {
                      HeThongRap: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!result) {
        return null;
      }

      const plainResult = {
        maPhim: result.ma_phim,
        tenPhim: result.ten_phim,
        trailer: result.trailer,
        hinhAnh: result.hinh_anh,
        moTa: result.mo_ta,
        hot: result.hot,
        dangChieu: result.dang_chieu,
        sapChieu: result.sap_chieu,
        ngayKhoiChieu: result.ngay_khoi_chieu,
        danhGia: result.danh_gia,
        heThongRapChieu: result.LichChieu?.reduce((acc, lichChieu) => {
          const { ma_he_thong_rap, ten_he_thong_rap, logo } =
            lichChieu.RapPhim.CumRap.HeThongRap;
          let heThongRap = acc.find(
            (item) => item.maHeThongRap === ma_he_thong_rap,
          );

          if (!heThongRap) {
            heThongRap = {
              maHeThongRap: ma_he_thong_rap,
              tenHeThongRap: ten_he_thong_rap,
              logo: logo,
              cumRapChieu: [],
            };
            acc.push(heThongRap);
          }

          const cumRap = lichChieu.RapPhim.CumRap;
          const existingCumRap = heThongRap.cumRapChieu.find(
            (item) => item.maCumRap === cumRap.ma_cum_rap,
          );

          if (!existingCumRap) {
            const newCumRap = {
              maCumRap: cumRap.ma_cum_rap,
              tenCumRap: cumRap.ten_cum_rap,
              diaChi: cumRap.dia_chi,
              lichChieuPhim: [],
            };
            heThongRap.cumRapChieu.push(newCumRap);
          }

          const lichChieuPhim = {
            maLichChieu: lichChieu.ma_lich_chieu.toString(),
            maRap: lichChieu.ma_rap.toString(),
            tenRap: lichChieu.RapPhim?.ten_rap,
            ngayChieuGioChieu: lichChieu.ngay_gio_chieu,
            giaVe: Number(lichChieu.gia_ve),
          };

          const cumRapToUpdate = heThongRap.cumRapChieu.find(
            (item) => item.maCumRap === cumRap.ma_cum_rap,
          );
          cumRapToUpdate.lichChieuPhim.push(lichChieuPhim);

          return acc;
        }, []),
      };

      return plainToClass(PhimDto, plainResult);
    } catch (error) {
      throw new Error(error);
    }
  }
}
