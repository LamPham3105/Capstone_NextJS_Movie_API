import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TypeNguoiDungDto } from './dto/TypeNguoiDung.dto';
import { TypeNguoiDung } from './enum/TypeNguoiDung.enum';
import { plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';
import { NguoiDungDto } from './dto/NguoiDung.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto, NguoiDungLoginDto } from './dto/Login.dto';
import { JwtService } from '@nestjs/jwt';
import { KeyService } from 'src/key/key.service';
import { NguoiDungInforDto } from './dto/NguoiDungInfor.dto';
import { ThemNguoiDungDto } from './dto/ThemNguoiDung.dto';

@Injectable()
export class QuanLyNguoiDungService {
  prisma = new PrismaClient();
  privatekey: string;

  private userTypes: TypeNguoiDungDto[];

  constructor(
    private jwtService: JwtService,
    private keyService: KeyService,
  ) {
    this.userTypes = this.loadUserTypes();
    this.privatekey = this.keyService.getPrivateKey();
  }

  private loadUserTypes(): TypeNguoiDungDto[] {
    const data = [
      {
        maLoaiNguoiDung: TypeNguoiDung.CUSTOMER,
        tenLoai: 'Khách hàng',
      },
      {
        maLoaiNguoiDung: TypeNguoiDung.ADMIN,
        tenLoai: 'Quản trị',
      },
    ];

    return data.map((item) =>
      plainToClass(TypeNguoiDungDto, {
        maTypeNguoiDung: item.maLoaiNguoiDung,
        tenTypeNguoiDung: item.tenLoai,
      }),
    );
  }

  getAllUserTypes(): TypeNguoiDungDto[] {
    return this.userTypes;
  }

  async findLayDanhSachNguoiDung(keyword: string): Promise<NguoiDungDto[]> {
    try {
      let result = await this.prisma.nguoiDung.findMany({
        where: keyword
          ? {
              ho_ten: {
                contains: keyword,
              },
            }
          : {},
      });

      if (!result || result.length <= 0) return [];

      return result.map((nguoiDung) => plainToClass(NguoiDungDto, nguoiDung));
    } catch (error) {
      throw new Error(error);
    }
  }

  async findLayDanhSachNguoiDungPhanTrang(
    page: number,
    size: number,
    keyword: string,
  ): Promise<NguoiDungDto[]> {
    try {
      let result = await this.prisma.nguoiDung.findMany({
        where: keyword
          ? {
              ho_ten: {
                contains: keyword,
              },
            }
          : {},
        skip: (page - 1) * size,
        take: size,
      });

      if (!result || result.length <= 0) return [];

      return result.map((nguoiDung) => plainToClass(NguoiDungDto, nguoiDung));
    } catch (error) {
      throw new Error(error);
    }
  }

  async dangKy(registerData: NguoiDungDto): Promise<NguoiDungDto> {
    try {
      if (!registerData.matKhau) {
        throw new BadRequestException('Password is required');
      }

      const { taiKhoan, email } = registerData;

      const existingEmail = await this.prisma.nguoiDung.findFirst({
        where: { email },
      });

      if (existingEmail) {
        throw new BadRequestException('Email is already taken!');
      }

      const existingTaiKhoan = await this.prisma.nguoiDung.findFirst({
        where: { tai_khoan: taiKhoan },
      });
      if (existingTaiKhoan) {
        throw new BadRequestException('Account number is already taken!');
      }

      registerData.loaiNguoiDung = TypeNguoiDung.KHACHHANG;

      const existingUser = await this.prisma.nguoiDung.findFirst({
        where: {
          OR: [
            { tai_khoan: registerData.taiKhoan },
            { email: registerData.email },
          ],
        },
      });

      if (existingUser) {
        return null;
      }

      const hashedPassword = await bcrypt.hash(registerData.matKhau, 10);

      const countNguoiDung = await this.prisma.nguoiDung.count();

      const createdUser = await this.prisma.nguoiDung.create({
        data: {
          tai_khoan: 'ND' + (countNguoiDung + 1),
          ho_ten: registerData.hoTen,
          email: registerData.email,
          so_dt: registerData.soDienThoai,
          mat_khau: hashedPassword,
          loai_nguoi_dung: registerData.loaiNguoiDung,
        },
      });

      return plainToClass(NguoiDungDto, createdUser);
    } catch (error) {
      throw error;
    }
  }

  async dangNhap(body: LoginDto): Promise<NguoiDungLoginDto> {
    try {
      const { taiKhoan, matKhau } = body;

      const checkNguoiDung = await this.prisma.nguoiDung.findFirst({
        where: { tai_khoan: taiKhoan },
      });

      if (!checkNguoiDung) {
        throw new NotFoundException('Tai khoan is wrong');
      }

      const isPasswordValid = await bcrypt.compare(
        matKhau,
        checkNguoiDung.mat_khau,
      );

      if (!isPasswordValid) {
        throw new NotFoundException('Invalid credentials');
      }

      const token = this.jwtService.sign(
        { data: { taiKhoan: checkNguoiDung.tai_khoan } },
        {
          expiresIn: '30m',
          algorithm: 'RS256',
          privateKey: this.privatekey,
        },
      );

      return plainToClass(NguoiDungLoginDto, {
        taiKhoan: checkNguoiDung.tai_khoan,
        hoTen: checkNguoiDung.ho_ten,
        email: checkNguoiDung.email,
        soDienThoai: checkNguoiDung.so_dt,
        loaiNguoiDung: checkNguoiDung.loai_nguoi_dung,
        accessToken: token,
      });
    } catch (error) {
      throw error;
    }
  }

  async getThongTinTaiKhoan(taiKhoan: string): Promise<NguoiDungInforDto> {
    try {
      const nguoiDung = await this.prisma.nguoiDung.findUnique({
        where: { tai_khoan: taiKhoan },
        include: {
          DatVe: {
            include: {
              LichChieu: {
                include: {
                  Phim: true,
                  RapPhim: true,
                },
              },
              Ghe: {
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
          },
        },
      });

      if (!nguoiDung) {
        throw new NotFoundException('Tài khoản không tồn tại!');
      }

      const nguoiDungDto = plainToClass(NguoiDungInforDto, {
        taiKhoan: nguoiDung.tai_khoan,
        matKhau: nguoiDung.mat_khau,
        hoTen: nguoiDung.ho_ten,
        email: nguoiDung.email,
        soDT: nguoiDung.so_dt,
        maLoaiNguoiDung: nguoiDung.loai_nguoi_dung,
        loaiNguoiDung: {
          maLoaiNguoiDung: nguoiDung.loai_nguoi_dung,
          tenLoai:
            nguoiDung.loai_nguoi_dung === 'KhachHang'
              ? 'Khách Hàng'
              : 'Quản Trị',
        },
        thongTinDatVe: nguoiDung.DatVe.map((datVe) => ({
          maVe: datVe.ma_lich_chieu, // Assuming ma_lich_chieu acts as ma_ve
          ngayDat: datVe.LichChieu.ngay_gio_chieu,
          tenPhim: datVe.LichChieu.Phim.ten_phim,
          hinhAnh: datVe.LichChieu.Phim.hinh_anh,
          giaVe: datVe.LichChieu.gia_ve,
          danhSachGhe: [
            {
              maHeThongRap: datVe.Ghe.RapPhim.CumRap.HeThongRap.ma_he_thong_rap,
              tenHeThongRap:
                datVe.Ghe.RapPhim.CumRap.HeThongRap.ten_he_thong_rap,
              maCumRap: datVe.Ghe.RapPhim.CumRap.ma_cum_rap,
              tenCumRap: datVe.Ghe.RapPhim.CumRap.ten_cum_rap,
              maRap: datVe.Ghe.RapPhim.ma_rap,
              tenRap: datVe.Ghe.RapPhim.ten_rap,
              maGhe: datVe.Ghe.ma_ghe,
              tenGhe: datVe.Ghe.ten_ghe,
            },
          ],
        })),
      });

      return nguoiDungDto;
    } catch (error) {
      throw new InternalServerErrorException(
        'Lỗi khi lấy thông tin tài khoản: ' + error.message,
      );
    }
  }

  async getLayThongTinNguoiDung(
    taiKhoanNguoiDung: string,
  ): Promise<NguoiDungInforDto> {
    try {
      const nguoiDung = await this.prisma.nguoiDung.findUnique({
        where: { tai_khoan: taiKhoanNguoiDung },
        include: {
          DatVe: {
            include: {
              LichChieu: {
                include: {
                  Phim: true,
                  RapPhim: true,
                },
              },
              Ghe: true,
            },
          },
        },
      });

      if (!nguoiDung) {
        throw new NotFoundException('Tài khoản không tồn tại!');
      }

      const nguoiDungDto = plainToClass(NguoiDungInforDto, {
        ...nguoiDung,
        thongTinDatVe: nguoiDung.DatVe.map((datVe) => ({
          ...datVe,
          danhSachGhe: datVe.Ghe,
          tenPhim: datVe.LichChieu.Phim.ten_phim,
          hinhAnh: datVe.LichChieu.Phim.hinh_anh,
          giaVe: datVe.LichChieu.gia_ve,
        })),
      });

      return nguoiDungDto;
    } catch (error) {
      throw new InternalServerErrorException(
        'Lỗi khi lấy thông tin tài khoản: ' + error.message,
      );
    }
  }

  async themNguoiDung(
    themNguoiDungDto: ThemNguoiDungDto,
  ): Promise<ThemNguoiDungDto> {
    const { taiKhoan, matKhau, email, soDt, maLoaiNguoiDung, hoTen } =
      themNguoiDungDto;

    try {
      const existingUser = await this.prisma.nguoiDung.findUnique({
        where: { tai_khoan: taiKhoan },
      });

      if (existingUser) {
        throw new BadRequestException('Tai khoan da ton tai');
      }

      const countNguoiDung = await this.prisma.nguoiDung.count();

      const user = await this.prisma.nguoiDung.create({
        data: {
          tai_khoan: 'ND' + (countNguoiDung + 1),
          mat_khau: matKhau,
          email: email,
          so_dt: soDt,
          loai_nguoi_dung: maLoaiNguoiDung,
          ho_ten: hoTen,
        },
      });

      return plainToClass(ThemNguoiDungDto, user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating user: ' + error.message,
      );
    }
  }

  async capNhatThongTinNguoiDung(
    capNhatThongTinNguoiDungDto: ThemNguoiDungDto,
  ) {
    try {
      const taiKhoan = capNhatThongTinNguoiDungDto.taiKhoan;

      const user = await this.prisma.nguoiDung.findUnique({
        where: { tai_khoan: taiKhoan },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await this.prisma.nguoiDung.update({
        where: { tai_khoan: taiKhoan },
        data: {
          ho_ten: capNhatThongTinNguoiDungDto.hoTen || user.ho_ten,
          email: capNhatThongTinNguoiDungDto.email || user.email,
          so_dt: capNhatThongTinNguoiDungDto.soDt || user.so_dt,
          loai_nguoi_dung:
            capNhatThongTinNguoiDungDto.maLoaiNguoiDung || user.loai_nguoi_dung,
          mat_khau: capNhatThongTinNguoiDungDto.matKhau || user.mat_khau,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new BadRequestException('Error updating user: ' + error.message);
    }
  }

  async xoaNguoiDung(taiKhoan: string): Promise<void> {
    try {
      const user = await this.prisma.nguoiDung.findUnique({
        where: { tai_khoan: taiKhoan },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.prisma.nguoiDung.delete({
        where: { tai_khoan: taiKhoan },
      });
    } catch (error) {
      throw new BadRequestException('Error deleting user: ' + error.message);
    }
  }
}
