import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/providers/prisma/prisma.service';
import { Request } from '@src/utils/services/request.service';
import { CreateUsageTermDto } from './dto/create-usage-term.dto';

@Injectable()
export class UsageTermsService {
  constructor(private readonly prisma: PrismaService, private readonly request: Request) {}

  async create(createDto: CreateUsageTermDto) {
    const lastUsageTerm = await this.prisma.usageTerms.findFirst({ orderBy: { version: 'desc' } });

    createDto.version = lastUsageTerm?.version + 1 || 1;
    createDto.createdBy = this.request.user.id;

    const newUsageTerm = await this.prisma.usageTerms.create({ data: createDto });

    return newUsageTerm;
  }

  async find() {
    return this.prisma.usageTerms.findFirst({ orderBy: { version: 'desc' } });
  }
}
