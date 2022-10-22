import { enumUserRoles } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  cpf: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  role: enumUserRoles;

  @Expose()
  usageTermsAcceptedAt: Date;

  @Expose()
  usageTermVersion: number;
}
