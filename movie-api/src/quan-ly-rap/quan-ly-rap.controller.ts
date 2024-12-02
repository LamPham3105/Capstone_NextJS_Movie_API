import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { QuanLyRapService } from './quan-ly-rap.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HeThongRapDto } from './dto/HeThongRap.dto';
import { CumRap } from '@prisma/client';
import { LichChieuHeThongRapDto } from './dto/LichChieuHeThongRap.dto';
import { PhimDto } from './dto/LichChieuPhim.dto';

@ApiTags('QuanLyRap')
@Controller('api/QuanLyRap')
export class QuanLyRapController {
  constructor(private readonly quanLyRapService: QuanLyRapService) {}

  @Get('/LayThongTinHeThongRap')
  @ApiQuery({ name: 'maHeThongRap', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the list of theater systems',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Theater system not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findLayThongTinHeThongRap(
    @Query('maHeThongRap') maHeThongRap: string,
    @Res() res: Response,
  ): Promise<Response<HeThongRapDto[]>> {
    try {
      let heThongRaps =
        await this.quanLyRapService.findLayThongTinHeThongRap(maHeThongRap);

      if (heThongRaps.length == 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Theater system not found',
          content: heThongRaps,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Successfully retrieved the list of theater systems',
        content: heThongRaps,
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

  @Get('/LayThongTinCumRapTheoHeThong')
  @ApiQuery({ name: 'maHeThongRap', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of cinema complexes retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cinema system not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findLayThongTinCumRapTheoHeThong(
    @Query('maHeThongRap') maHeThongRap: string,
    @Res() res: Response,
  ): Promise<Response<CumRap[]>> {
    try {
      let cumRapHeThongRaps =
        await this.quanLyRapService.findLayThongTinCumRapTheoHeThong(
          maHeThongRap,
        );

      if (cumRapHeThongRaps.length == 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Cinema system not found',
          content: cumRapHeThongRaps,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'List of cinema complexes retrieved successfully',
        content: cumRapHeThongRaps,
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

  @Get('/LayThongTinLichChieuHeThongRap')
  @ApiQuery({ name: 'maHeThongRap', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Successfully fetched cinema complex and showtimes information.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cinema system not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findLayThongTinLichChieuHeThongRap(
    @Query('maHeThongRap') maHeThongRap: string,
    @Res() res: Response,
  ): Promise<Response<LichChieuHeThongRapDto[]>> {
    try {
      let results =
        await this.quanLyRapService.findLayThongTinLichChieuHeThongRap(
          maHeThongRap,
        );

      if (!results || results.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          mmessage: 'Cinema system not found',
          content: [],
          dateTime: new Date(),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message:
          'List of cinema complexes and showtimes retrieved successfully',
        content: results,
        dateTime: new Date(),
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        content: error.stack,
        dateTime: new Date(),
      });
    }
  }

  @Get('/LayThongTinLichChieuPhim')
  @ApiQuery({ name: 'maPhim', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Successfully fetched cinema complex and showtimes information.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movie not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findLayThongTinLichChieuPhim(
    @Query('maPhim') maPhim: string,
    @Res() res: Response,
  ): Promise<Response<PhimDto>> {
    try {
      let result =
        await this.quanLyRapService.findLayThongTinLichChieuPhim(maPhim);

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Movie not found',
          content: [],
          dateTime: new Date(),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message:
          'List of cinema complexes and showtimes retrieved successfully',
        content: result,
        dateTime: new Date(),
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error: ' + error.message,
        content: error.stack,
        dateTime: new Date(),
      });
    }
  }
}
