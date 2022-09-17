import { Module } from '@nestjs/common';
import { BaseCacheModule } from './cache/cache.module';
import { JwtModule } from './jwt/jwt.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [BaseCacheModule, PrismaModule, JwtModule],
  providers: [],
  exports: [],
})
export class ProvidersModule {}
