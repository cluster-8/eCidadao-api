import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/providers/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { QuerybuilderService } from '@src/providers/prisma/querybuilder/querybuilder.service';
import defaultPlainToClass from '@src/utils/functions/default.plain.to.class.fn';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly authService: AuthService, private readonly qb: QuerybuilderService) {}

  async create(createDto: CreateUserDto) {
    await this.checkUserAlreadyExists(createDto.email, createDto.cpf);

    await this.checkUsageTerms(createDto.usageTermsVersion);

    delete createDto.passwordConfirmation;

    const user = await this.prisma.user.create({ data: { ...createDto, password: bcrypt.hashSync(createDto.password, 10) } });

    const token = this.authService.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  private async checkUserAlreadyExists(email: string, cpf: string) {
    const userAlreadyExist = await this.prisma.user.findFirst({ where: { OR: { email: email, cpf: cpf } } });

    if (userAlreadyExist) throw new BadRequestException('Cpf or email already exists');
  }

  private async checkUsageTerms(version: number) {
    const usageTerms = await this.prisma.usageTerms.findUnique({ where: { version } });

    if (!usageTerms) throw new BadRequestException('UsageTerms not found');
  }

  async findOne(id: string) {
    const { select } = await this.qb.query('user', 'id', { id });

    const user = await this.prisma.user.findUnique({ where: { id }, select });

    return defaultPlainToClass(UserDto, user);
  }

  async update(id: string, updateDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
