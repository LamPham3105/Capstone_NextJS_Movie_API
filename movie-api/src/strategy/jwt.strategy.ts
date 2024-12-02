import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { KeyService } from 'src/key/key.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(keyService: KeyService) {
    const publicKey = keyService.getPublicKey();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }
  prisma = new PrismaClient();

  async validate(tokenDecode: any) {
    let taiKhoan = tokenDecode.data.taiKhoan;
    const checkUser = await this.prisma.nguoiDung.findFirst({
      where: { tai_khoan: taiKhoan },
    });

    if (!checkUser) {
      return [];
    }
    return checkUser;
  }
}
