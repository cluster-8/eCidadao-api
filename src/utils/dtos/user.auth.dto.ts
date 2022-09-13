import { enumUserRoles } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class UserAuth {
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsEnum(enumUserRoles)
  @IsNotEmpty()
  role: enumUserRoles;
}
