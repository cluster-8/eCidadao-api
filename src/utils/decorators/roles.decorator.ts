import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: enumRoles[]) => SetMetadata('roles', roles);

export enum enumRoles {
  admin,
  client,
  technical,
  isSameUser,
}
