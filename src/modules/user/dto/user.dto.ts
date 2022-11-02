import { enumUserRoles } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UsageTermsAccepted } from './create-user.dto';

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
  @Type(() => UsageTermsAccepted)
  @ValidateNested({ each: true })
  usageTermsAccepted: UsageTermsAccepted;
}
