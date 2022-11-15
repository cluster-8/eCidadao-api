import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/providers/prisma/prisma.service';
import { QuerybuilderService } from '@src/providers/prisma/querybuilder/querybuilder.service';
import { SqlitePrismaService } from '@src/providers/prisma/sqlite/sqlite.prisma.service';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly sqlite: SqlitePrismaService,
    private readonly authService: AuthService,
    private readonly qb: QuerybuilderService
  ) {}

  async create(createDto: CreateUserDto) {
    await this.checkUserAlreadyExists(createDto.email, createDto.cpf);

    await this.checkUsageTerms(createDto.usageTermsAccepted);

    delete createDto.passwordConfirmation;

    createDto = await this.encryptUser(createDto);

    const user = await this.prisma.user.create({ data: { ...createDto } });

    const token = this.authService.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  async encryptUser(createDto: CreateUserDto) {
    const key = crypto.randomBytes(16).toString('hex');

    const secret = await this.sqlite.userKeys.create({ data: { secret: key } });

    createDto.secretId = secret.id;

    createDto.hashCpf = bcrypt.hashSync(createDto.cpf, 10);
    createDto.hashEmail = bcrypt.hashSync(createDto.email, 10);

    createDto.password = bcrypt.hashSync(createDto.password, 10);

    createDto.cpf = encrypt(createDto.cpf, key);
    createDto.email = encrypt(createDto.email, key);

    return createDto;
  }

  private async checkUserAlreadyExists(email: string, cpf: string) {
    const userAlreadyExist = await this.prisma.user.findFirst({ where: { OR: [{ email: email }, { cpf: cpf }] } });

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

    if (updateDto?.oldPassword && bcrypt.hashSync(updateDto.oldPassword, 10) !== user.password) {
      throw new BadRequestException('Old password does not match');
    }

    if (updateDto?.newPassword) {
      updateDto.password = bcrypt.hashSync(updateDto.newPassword, 10);

      delete updateDto.oldPassword;
      delete updateDto.newPassword;
      delete updateDto.newPasswordConfirmation;
    }

    await this.prisma.user.update({ where: { id }, data: updateDto });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new BadRequestException('User not found');

    await this.prisma.user.delete({ where: { id } });
  }
}
