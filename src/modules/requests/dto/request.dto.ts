import { enumComumTypeRequest, enumStatusRequest } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class RequestDto {
  @Expose()
  id: string;

  @Expose()
  identifier: number;

  @Expose()
  image: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => AddressDto)
  address: AddressDto;

  @Expose()
  type: enumComumTypeRequest;

  @Expose()
  status: enumStatusRequest;

  @Expose()
  finishedImage: string;

  @Expose()
  finishedDescription: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  finishedAt: Date;
}
