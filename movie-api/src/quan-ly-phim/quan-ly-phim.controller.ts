import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { QuanLyPhimService } from './quan-ly-phim.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BannerDto } from './dto/banner.dto';
import { Response } from 'express';
import { PhimDto } from './dto/Phim.dto';
import { FileUploadDto } from './dto/Image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { getStorageOptions } from 'src/shared/upload.service';
import { CreatePhimDto, CreatePhimDtoWithFile } from './dto/CreatePhim.dto';

@ApiTags('QuanLyPhim')
@Controller('api/QuanLyPhim')
export class QuanLyPhimController {
  constructor(private readonly quanLyPhimService: QuanLyPhimService) {}

  @Get('/LayDanhSachBanner')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list banner successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found banner',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findLayDanhSachBanner(
    @Res() res: Response,
  ): Promise<Response<BannerDto[]>> {
    try {
      let results = await this.quanLyPhimService.findLayDanhSachBanner();

      if (results.length == 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found banner',
          content: results,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Get list banner successfully',
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

  @Get('/LayDanhSachPhim')
  @ApiQuery({ name: 'tenPhim', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list of films successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found film',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findLayDanhSachPhim(
    @Query('tenPhim') tenPhim: string,
    @Res() res: Response,
  ): Promise<Response<PhimDto[]>> {
    try {
      let results = await this.quanLyPhimService.findLayDanhSachPhim(tenPhim);

      if (results.length == 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found film',
          content: results,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Get list of films successfully',
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

  @Get('/LayDanhSachPhimPhanTrang')
  @ApiQuery({ name: 'tenPhim', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, default: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list of films successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found film',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findLayDanhSachPhimPhanTrang(
    @Query('tenPhim') tenPhim: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Res() res: Response,
  ): Promise<Response<PhimDto[]>> {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      let resultPhims =
        await this.quanLyPhimService.findLayDanhSachPhim(tenPhim);

      let results = await this.quanLyPhimService.findLayDanhSachPhimPhanTrang(
        formatPage,
        formatSize,
        tenPhim,
      );

      if (results.length == 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found film',
          content: results,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Get list of films successfully',
        content: {
          currentPage: formatPage,
          count: formatSize,
          totalPages: Math.ceil(resultPhims.length / formatSize),
          totalCount: resultPhims.length,
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

  @Get('/LayDanhSachPhimTheoNgay')
  @ApiQuery({ name: 'tenPhim', required: false, type: String })
  @ApiQuery({ name: 'tuNgay', required: false, type: String })
  @ApiQuery({ name: 'denNgay', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, default: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list film successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found film',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findLayDanhSachPhimTheoNgay(
    @Query('tenPhim') tenPhim: string,
    @Query('tuNgay') startDate: string,
    @Query('denNgay') endDate: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Res() res: Response,
  ): Promise<Response<PhimDto[]>> {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      let results = await this.quanLyPhimService.findLayDanhSachPhimTheoNgay(
        formatPage,
        formatSize,
        tenPhim,
        startDate,
        endDate,
      );

      if (results.length == 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found film',
          content: results,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Get list of films successfully',
        content: {
          currentPage: formatPage,
          count: formatSize,
          totalPages: Math.ceil(results.length / formatSize),
          totalCount: results.length,
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

  @Get('/LayThongTinPhim')
  @ApiQuery({ name: 'maPhim', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list of films successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found film',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findLayThongTinPhim(
    @Query('maPhim') maPhim: string,
    @Res() res: Response,
  ): Promise<Response<PhimDto[]>> {
    try {
      let result = await this.quanLyPhimService.findLayThongTinPhim(maPhim);

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found film',
          content: result,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Get list of films successfully',
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

  @ApiBearerAuth()
  @Post('/ThemPhim')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreatePhimDtoWithFile,
    required: true,
  })
  @UseInterceptors(
    FileInterceptor('hinhAnh', { storage: getStorageOptions('videos') }),
  )
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Movie created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error creating movie',
  })
  async createPhimWithFile(
    @Body() createPhimDto: CreatePhimDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (file) {
        createPhimDto.hinhAnh = file.filename;
      }

      const newMovie = await this.quanLyPhimService.createPhim(createPhimDto);

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Movie created successfully',
        content: newMovie,
        dateTime: new Date(Date.now()),
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        dateTime: new Date(Date.now()),
      });
    }
  }

  @ApiBearerAuth()
  @Delete('/XoaPhim')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movie not found',
  })
  async deletePhim(@Query('maPhim') maPhim: string, @Res() res: Response) {
    try {
      await this.quanLyPhimService.deletePhim(maPhim);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Movie deleted successfully',
        dateTime: new Date(),
      });
    } catch (error) {
      return res
        .status(error.getStatus ? error.getStatus() : HttpStatus.BAD_REQUEST)
        .json({
          statusCode: error.getStatus
            ? error.getStatus()
            : HttpStatus.BAD_REQUEST,
          message: error.message,
          dateTime: new Date(),
        });
    }
  }
}
