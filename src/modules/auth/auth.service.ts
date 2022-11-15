import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/providers/prisma/prisma.service';
import defaultPlainToClass from '@src/utils/functions/default.plain.to.class.fn';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserDto } from '../user/dto/user.dto';
import { SignInDto } from './dto/sign.in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  generateToken(id: string, email: string, role: string) {
    const payload = { id: id, email: email, role: role };

    const token = this.jwtService.sign(payload);

    return token;
  }

  async signIn(body: SignInDto) {
    const hashEmail = crypto.createHash('md5').update(body.email).digest('hex');

    const user = await this.prisma.user.findFirst({ where: { hashEmail } });

    if (!user) throw new BadRequestException('Incorrect email/password combination');

    const passwordMatched = await bcrypt.compare(body.password, user.password);

    if (!passwordMatched) throw new BadRequestException('Incorrect email/password combination');

    const token = this.generateToken(user.id, user.email, user.role);

    return { user: defaultPlainToClass(UserDto, user), token };
  }
}
