import { Global, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';

@Global()
@Injectable()
export class Request {
  constructor(@Inject(REQUEST) private readonly request: ExpressRequest) {}

  get req() {
    return this.request;
  }

  get user() {
    return this.request.user;
  }
}
