import { BadRequestException, Injectable } from '@nestjs/common';
import { UserKeys } from '@sqlite/prisma/client';
import { PrismaService } from '@src/providers/prisma/prisma.service';
import { QuerybuilderService } from '@src/providers/prisma/querybuilder/querybuilder.service';
import { sqlitePrisma } from '@src/providers/prisma/sqlite/sqlite.prisma.fn';
import defaultPlainToClass from '@src/utils/functions/default.plain.to.class.fn';
import { encrypt } from '@src/utils/functions/encrypter.fn';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto, UsageTermsAccepted } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly authService: AuthService, private readonly qb: QuerybuilderService) {}

  async create(createDto: CreateUserDto) {
    await this.checkUserAlreadyExists(createDto.email, createDto.cpf);

    await this.checkUsageTerms(createDto.usageTermsAccepted);

    delete createDto.passwordConfirmation;

    createDto = await this.encryptUserOnCreate(createDto);

    const user = await this.prisma.user.create({ data: { ...createDto } });

    const token = this.authService.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  async encryptUserOnCreate(createDto: CreateUserDto) {
    const key = crypto.randomBytes(16).toString('hex');

    const secret = await sqlitePrisma.userKeys.create({ data: { secret: key } });

    createDto.secretId = secret.id;

    createDto.hashCpf = this.hashMd5(createDto.cpf);

    createDto.hashEmail = this.hashMd5(createDto.email);

    createDto.password = bcrypt.hashSync(createDto.password, 10);

    createDto.cpf = encrypt(createDto.cpf, key);
    createDto.name = encrypt(createDto.name, key);
    createDto.email = encrypt(createDto.email, key);

    return createDto;
  }

  private async checkUserAlreadyExists(email: string, cpf: string) {
    const hashCpf = this.hashMd5(cpf);
    const hashEmail = this.hashMd5(email);

    const userAlreadyExist = await this.prisma.user.findFirst({ where: { OR: [{ hashCpf }, { hashEmail }] } });

    if (userAlreadyExist) throw new BadRequestException('Cpf or email already exists');
  }

  private async checkUsageTerms(usageTermsAccepted: UsageTermsAccepted) {
    const usageTerms = await this.prisma.usageTerms.findUnique({ where: { id: usageTermsAccepted.usageTermsId } });

    if (!usageTerms) throw new BadRequestException('UsageTerms not found');

    const usageTermsItensIds = usageTerms.itens.map((v) => v.id);

    if (usageTermsItensIds.length !== usageTermsAccepted.usageTermsAcceptedItens.length) throw new BadRequestException('You need to accept all the usageTerms');

    usageTermsAccepted.usageTermsAcceptedItens.forEach((v) => {
      if (!usageTermsItensIds.includes(v)) throw new BadRequestException(`usageTermsAcceptedItens '${v}' not found`);
    });
  }

  async findOne(id: string) {
    const { select } = await this.qb.query('user', 'id', { id });

    const user = await this.prisma.user.findUnique({ where: { id }, select });

    if (!user) throw new BadRequestException('User not found');

    return defaultPlainToClass(UserDto, user);
  }

  async update(id: string, updateDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new BadRequestException('User not found');

    const userKey = await sqlitePrisma.userKeys.findUnique({ where: { id: user.secretId } });

    if (!userKey) throw new BadRequestException('User key not found');

    if (updateDto?.oldPassword && bcrypt.hashSync(updateDto.oldPassword, 10) !== user.password) {
      throw new BadRequestException('Old password does not match');
    }

    if (updateDto?.newPassword) {
      updateDto.password = bcrypt.hashSync(updateDto.newPassword, 10);

      delete updateDto.oldPassword;
      delete updateDto.newPassword;
      delete updateDto.newPasswordConfirmation;
    }

    if (updateDto.email || updateDto.name) {
      updateDto = await this.encryptUserOnUpdate(updateDto, userKey);
    }

    await this.prisma.user.update({ where: { id }, data: updateDto });
  }

  async encryptUserOnUpdate(updateDto: UpdateUserDto, userKey: UserKeys) {
    if (updateDto.email) {
      updateDto.hashEmail = this.hashMd5(updateDto.email);

      updateDto.email = encrypt(updateDto.email, userKey.secret);
    }

    if (updateDto.name) {
      updateDto.name = encrypt(updateDto.name, userKey.secret);
    }

    return updateDto;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new BadRequestException('User not found');

    await sqlitePrisma.userKeys.delete({ where: { id: user?.secretId } }).catch(() => {
      return;
    });

    await this.prisma.user.update({ where: { id }, data: { hashCpf: null, hashEmail: null } }).catch(() => {
      return;
    });
  }

  private hashMd5(data: string) {
    return crypto.createHash('md5').update(data).digest('hex');
  }
}
