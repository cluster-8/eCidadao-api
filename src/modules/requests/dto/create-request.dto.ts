import { enumComumTypeRequest, enumStatusRequest } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AdressDto } from './adress.dto';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Type(() => AdressDto)
  @ValidateNested()
  adress: AdressDto;

  @IsEnum(enumComumTypeRequest)
  @IsNotEmpty()
  type: enumComumTypeRequest;

  createdBy?: string;
  status?: enumStatusRequest;
}
