import { Module } from '@nestjs/common';
import { QuanLyPhimService } from './quan-ly-phim.service';
import { QuanLyPhimController } from './quan-ly-phim.controller';
import { KeysModule } from 'src/key/key.module';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  imports: [KeysModule],
  controllers: [QuanLyPhimController],
  providers: [QuanLyPhimService, JwtStrategy],
})
export class QuanLyPhimModule {}
