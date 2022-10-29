import { Global, Module } from '@nestjs/common';
import { SqlitePrismaService } from './sqlite.prisma.service';

@Global()
@Module({
  imports: [],
  providers: [SqlitePrismaService],
  exports: [SqlitePrismaService],
})
export class SqlitePrismaModule {}
