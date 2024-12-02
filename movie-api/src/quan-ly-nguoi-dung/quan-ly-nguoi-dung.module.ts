import { Module } from '@nestjs/common';
import { QuanLyNguoiDungService } from './quan-ly-nguoi-dung.service';
import { QuanLyNguoiDungController } from './quan-ly-nguoi-dung.controller';
import { KeysModule } from 'src/key/key.module';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), KeysModule],
  controllers: [QuanLyNguoiDungController],
  providers: [QuanLyNguoiDungService, JwtStrategy],
})
export class QuanLyNguoiDungModule {}
