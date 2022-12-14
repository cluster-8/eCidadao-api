import { Global, Module } from '@nestjs/common';
import { Querybuilder } from 'nestjs-prisma-querybuilder';
import { PrismaMiddlewareService } from './middleware/prisma.middleware.service';
import { PrismaService } from './prisma.service';
import { QuerybuilderService } from './querybuilder/querybuilder.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaService, QuerybuilderService, Querybuilder, PrismaMiddlewareService],
  exports: [PrismaService, QuerybuilderService],
})
export class PrismaModule {}
