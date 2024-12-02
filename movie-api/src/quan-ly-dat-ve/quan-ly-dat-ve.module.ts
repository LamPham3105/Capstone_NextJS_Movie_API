import { Module } from '@nestjs/common';
import { QuanLyDatVeService } from './quan-ly-dat-ve.service';
import { QuanLyDatVeController } from './quan-ly-dat-ve.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { KeysModule } from 'src/key/key.module';

@Module({
  imports: [KeysModule],
  controllers: [QuanLyDatVeController],
  providers: [QuanLyDatVeService, JwtStrategy],
})
export class QuanLyDatVeModule {}
