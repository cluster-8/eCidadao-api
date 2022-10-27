import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ log: [{ emit: 'stdout', level: 'query' }] });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}

export function UserDecryptMiddleware<T extends Prisma.BatchPayload = Prisma.BatchPayload>(): Prisma.Middleware {
  return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<T>): Promise<T> => {
    const result = await next(params);

    // if (params.model === 'User') {
    // }

    // const models: Prisma.ModelName = '';

    console.log('result: ', result);

    return result;
  };
}
