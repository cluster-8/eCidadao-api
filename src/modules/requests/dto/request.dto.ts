import { enumComumTypeRequest, enumStatusRequest } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { AdressDto } from './adress.dto';

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
  @Type(() => AdressDto)
  adress: AdressDto;

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
