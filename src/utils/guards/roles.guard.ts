import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { enumRoles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<enumRoles[]>('roles', context.getHandler())?.map((v) => enumRoles[v]);

    if (!roles || !roles.length) return true;

    const request: Request = context.switchToHttp().getRequest();

    const reqUser = request.user;

    if (!reqUser) return false;

    if (roles.includes('isSameUser')) return request.params.id === reqUser.id;

    if (roles.find((v) => v === String(reqUser?.role))) return true;

    return false;
  }
}
