import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@src/providers/prisma/prisma.service';
import { QuerybuilderService } from '@src/providers/prisma/querybuilder/querybuilder.service';
import defaultPlainToClass from '@src/utils/functions/default.plain.to.class.fn';
import { getGoogleGeocode } from '@src/utils/functions/google.geocode.fn';
import { Request } from '@src/utils/services/request.service';
import { plainToClass } from 'class-transformer';
import { AddressDto } from './dto/address.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestDto } from './dto/request.dto';
import { FinishRequestDto, UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService, private readonly qb: QuerybuilderService, private readonly request: Request) {}

  async create(createDto: CreateRequestDto) {
    createDto.createdBy = this.request?.user?.id;

    createDto.address = await this.buildAddress(createDto.address.lat, createDto.address.long);

    const identifier = await this.getIdentifier();

    const request = await this.prisma.request.create({ data: { ...createDto, identifier } });

    return request;
  }

  private async buildAddress(lat: string, long: string, number?: number) {
    const googleGeocode = await getGoogleGeocode(lat, long);

    return plainToClass(AddressDto, { ...googleGeocode, number: number || googleGeocode.number });
  }

  private async getIdentifier() {
    const lastCreatedRequest = await this.prisma.request.findFirst({ orderBy: { identifier: 'desc' } });

    return lastCreatedRequest?.identifier + 1 || 1;
  }

  async findTechical() {
    const query = await this.qb.query('request', 'id');

    return defaultPlainToClass(RequestDto, this.prisma.request.findMany(query));
  }

  async find() {
    const user = this.request.user;

    const query = await this.qb.query('request', 'id');

    query.where = { ...query.where, createdBy: user?.id };

    return defaultPlainToClass(RequestDto, this.prisma.request.findMany(query));
  }

  async findAddressFromGoogleGeocode(lat: string, long: string) {
    return this.buildAddress(lat, long);
  }

  async finishRequest(id: string, finishDto: FinishRequestDto) {
    const request = await this.prisma.request.findUnique({ where: { id } });

    if (!request) throw new BadRequestException('Request not found');

    if (request.finishedBy !== null) throw new BadRequestException('This request already finished');

    const user = this.request.user;

    finishDto.status = 'closed';
    finishDto.finishedBy = user?.id;
    finishDto.finishedAt = new Date();

    await this.prisma.request.update({ where: { id }, data: finishDto });
  }

  async update(id: string, updateDto: UpdateRequestDto) {
    const request = await this.prisma.request.findUnique({ where: { id } });

    if (!request) throw new BadRequestException('Request not found');

    const user = this.request.user;

    if (request.finishedBy !== null) throw new BadRequestException('This request already finished');

    if (request.createdBy !== user?.id) throw new UnauthorizedException('Unauthorized');

    await this.prisma.request.update({ where: { id }, data: updateDto });
  }

  async remove(id: string) {
    const user = this.request.user;

    const request = await this.prisma.request.findUnique({ where: { id } });

    if (!request) throw new BadRequestException('Request not found');

    if (request.finishedBy !== null) throw new BadRequestException('This request already finished');

    if (request.createdBy !== user?.id) throw new UnauthorizedException('Unauthorized');

    await this.prisma.request.delete({ where: { id } });
  }
}
