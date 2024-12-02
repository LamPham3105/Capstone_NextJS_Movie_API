import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QuanLyDatVeService } from './quan-ly-dat-ve.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LichChieuResponseDTO } from './dto/LichChieuResponse.dto';
import { AuthGuard } from '@nestjs/passport';
import { DatVeDto } from './dto/DatVe.dto';
import { LichChieuDto } from './dto/LichChieu.dto';

@ApiTags('QuanLyDatVe')
@Controller('api/QuanLyDatVe')
export class QuanLyDatVeController {
  constructor(private readonly quanLyDatVeService: QuanLyDatVeService) {}

  @Get('/LayDanhSachPhongVe')
  @ApiQuery({ name: 'maLichChieu', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get lich chieu successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found lich chieu',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server',
  })
  async findLayDanhSachPhongVe(
    @Query('maLichChieu') maLichChieu: string,
    @Res() res: Response,
  ): Promise<Response<LichChieuResponseDTO>> {
    try {
      let result =
        await this.quanLyDatVeService.findLayDanhSachPhongVe(maLichChieu);

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found lich chieu',
          content: result,
          dateTime: new Date(Date.now()),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Get lich chieu successfully',
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
  @Post('/DatVe')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    description: 'Booking ticket data',
    type: [DatVeDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tickets booked successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or tickets unavailable',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async datVe(
    @Body() datVeDtos: DatVeDto[],
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const tai_khoan = req['user'].tai_khoan;

      const results = await this.quanLyDatVeService.datVe(tai_khoan, datVeDtos);

      if (results.some((result) => result.message.includes('Lỗi'))) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: results[0].message,
          dateTime: new Date(),
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Tickets processed successfully',
        content: results,
        dateTime: new Date(),
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Invalid input or tickets unavailable',
          dateTime: new Date(),
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
        content: error.response || null,
        dateTime: new Date(),
      });
    }
  }

  @ApiBearerAuth()
  @Post('/TaoLichChieu')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    description: 'Create a new Lich Chieu',
    type: LichChieuDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lich Chieu created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or Lich Chieu already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async createLichChieu(
    @Body() lichChieuDto: LichChieuDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const lichChieu =
        await this.quanLyDatVeService.createLichChieu(lichChieuDto);

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Lich Chieu created successfully',
        content: lichChieu,
        dateTime: new Date(),
      });
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            error.message || 'Invalid input or Lich Chieu already exists',
          content: null,
          dateTime: new Date(),
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
        content: error.response || null,
        dateTime: new Date(),
      });
    }
  }
}
