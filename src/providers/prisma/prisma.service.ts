import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMiddlewareService } from './middleware/prisma.middleware.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly middleware: PrismaMiddlewareService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();

    this.$use(this.middleware.UserDecrypt);
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
