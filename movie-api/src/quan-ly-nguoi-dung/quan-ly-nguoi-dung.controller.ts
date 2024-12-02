import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QuanLyNguoiDungService } from './quan-ly-nguoi-dung.service';
import { TypeNguoiDungDto } from './dto/TypeNguoiDung.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NguoiDungDto } from './dto/NguoiDung.dto';
import { Request, Response } from 'express';
import { LoginDto, NguoiDungLoginDto } from './dto/Login.dto';
import { AuthGuard } from '@nestjs/passport';
import { NguoiDungInforDto } from './dto/NguoiDungInfor.dto';
import { ThemNguoiDungDto } from './dto/ThemNguoiDung.dto';

@ApiTags('QuanLyNguoiDung')
@Controller('api/QuanLyNguoiDung')
export class QuanLyNguoiDungController {
  constructor(
    private readonly quanLyNguoiDungService: QuanLyNguoiDungService,
  ) {}

  @Get('/LayDanhSachLoaiNguoiDung')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list type nguoi dung successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found type nguoi dung',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server',
  })
  getAllUserTypes(@Res() res: Response): Response<TypeNguoiDungDto[]> {
    try {
      let result = this.quanLyNguoiDungService.getAllUserTypes();

      if (result == null) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found nguoi dung',
          content: result,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Get list nguoi dung successfully',
        content: result,
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        content: error.content,
        dateTime: new Date(Date.now()),
      });
    }
  }

  @Get('/LayDanhSachNguoiDung')
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list nguoi dung successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found nguoi dung',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server',
  })
  async findLayDanhSachNguoiDung(
    @Query('keyword') keyword: string,
    @Res() res: Response,
  ): Promise<Response<NguoiDungDto[]>> {
    try {
      let results =
        await this.quanLyNguoiDungService.findLayDanhSachNguoiDung(keyword);

      if (results.length == 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found nguoi dung',
          content: results,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Get list nguoi dung successfully',
        content: results,
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        content: error.content,
        dateTime: new Date(Date.now()),
      });
    }
  }

  @Get('/LayDanhSachNguoiDungPhanTrang')
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, default: 20 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list nguoi dung successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found nguoi dung',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server',
  })
  async findLayDanhSachNguoiDungPhanTrang(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Res() res: Response,
  ): Promise<Response<NguoiDungDto[]>> {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      let resultNguoiDungs =
        await this.quanLyNguoiDungService.findLayDanhSachNguoiDung(keyword);

      let results =
        await this.quanLyNguoiDungService.findLayDanhSachNguoiDungPhanTrang(
          formatPage,
          formatSize,
          keyword,
        );

      if (results.length == 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found nguoi dung',
          content: results,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Get list nguoi dung successfully',
        content: {
          currentPage: formatPage,
          count: formatSize,
          totalPages: Math.ceil(resultNguoiDungs.length / formatSize),
          totalCount: resultNguoiDungs.length,
          items: results,
        },
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        content: error.content,
        dateTime: new Date(Date.now()),
      });
    }
  }

  @Post('/DangKy')
  @ApiBody({
    description: 'Nguoi Dung registration data',
    type: NguoiDungDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nguoi Dung registered successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Nguoi Dung Da Ton Tai',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server',
  })
  async dangKy(
    @Body() registerData: NguoiDungDto,
    @Res() res: Response,
  ): Promise<Response<NguoiDungDto>> {
    try {
      let result = await this.quanLyNguoiDungService.dangKy(registerData);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Nguoi Dung registered successfully',
        content: result,
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        content: error.content,
        dateTime: new Date(Date.now()),
      });
    }
  }

  @Post('/DangNhap')
  @ApiBody({
    description: 'Nguoi Dung login data',
    type: LoginDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nguoi Dung login successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tai khoan or mat khau is not corrected',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server',
  })
  async dangNhap(
    @Body() loginData: LoginDto,
    @Res() res: Response,
  ): Promise<Response<NguoiDungLoginDto>> {
    try {
      let result = await this.quanLyNguoiDungService.dangNhap(loginData);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Nguoi Dung login successfully',
        content: result,
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred',
        content: error.content || null,
        dateTime: new Date(Date.now()),
      });
    }
  }

  @ApiBearerAuth()
  @Get('/ThongTinTaiKhoan')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User information fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getThongTinTaiKhoan(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<NguoiDungInforDto>> {
    try {
      const taiKhoan = req['user'].tai_khoan;
      const nguoiDung =
        await this.quanLyNguoiDungService.getThongTinTaiKhoan(taiKhoan);

      if (!nguoiDung) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User information not found',
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User information fetched successfully',
        content: nguoiDung,
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred',
        content: error.content || null,
        dateTime: new Date(Date.now()),
      });
    }
  }

  @ApiBearerAuth()
  @Get('/LayThongTinNguoiDung')
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'taiKhoan', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User information fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getLayThongTinNguoiDung(
    @Req() req: Request,
    @Res() res: Response,
    @Query('taiKhoan') taiKhoan: string,
  ): Promise<Response<NguoiDungInforDto>> {
    try {
      const nguoiDung =
        await this.quanLyNguoiDungService.getThongTinTaiKhoan(taiKhoan);

      if (!nguoiDung) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User information not found',
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User information fetched successfully',
        content: nguoiDung,
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred',
        content: error.content || null,
        dateTime: new Date(Date.now()),
      });
    }
  }

  @ApiBearerAuth()
  @Post('/ThemNguoiDung')
  @ApiBody({
    description: 'Data for creating a new user',
    type: ThemNguoiDungDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or user already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async themNguoiDung(
    @Body() themNguoiDungDto: ThemNguoiDungDto,
    @Res() res: Response,
  ) {
    try {
      const newUser =
        await this.quanLyNguoiDungService.themNguoiDung(themNguoiDungDto);

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        content: newUser,
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      if (
        error.response &&
        error.response.statusCode === HttpStatus.BAD_REQUEST
      ) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred',
        dateTime: new Date(Date.now()),
      });
    }
  }

  @ApiBearerAuth()
  @Put('/CapNhatThongTinNguoiDung')
  @ApiBody({
    description: 'Data for creating a new user',
    type: ThemNguoiDungDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or user already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async capNhatThongTinNguoiDung(
    @Body() capNhatThongTinNguoiDungDto: ThemNguoiDungDto,
    @Res() res: Response,
  ) {
    try {
      const updatedUser =
        await this.quanLyNguoiDungService.capNhatThongTinNguoiDung(
          capNhatThongTinNguoiDungDto,
        );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User information updated successfully',
        content: updatedUser,
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred',
        dateTime: new Date(Date.now()),
      });
    }
  }

  @ApiBearerAuth()
  @Delete('/XoaNguoiDung')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request or error occurred',
  })
  async xoaNguoiDung(
    @Query('taiKhoan') taiKhoan: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.quanLyNguoiDungService.xoaNguoiDung(taiKhoan);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
        content: user,
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
        dateTime: new Date(Date.now()),
      });
    }
  }
}
