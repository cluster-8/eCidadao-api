import { enumComumTypeRequest, enumStatusRequest } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AddressDto } from './address.dto';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Type(() => AddressDto)
  @ValidateNested()
  address: AddressDto;

  @IsEnum(enumComumTypeRequest)
  @IsNotEmpty()
  type: enumComumTypeRequest;

  createdBy?: string;
  status?: enumStatusRequest;
}
