import { enumStatusRequest } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image: string;
}

export class FinishRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  finishedImage: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  finishedDescription: string;

  finishedAt: Date;
  finishedBy: string;
  status: enumStatusRequest;
}
