import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModulesModule } from './modules/modules.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      isGlobal: true,
    }),
    ModulesModule,
    ProvidersModule,
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppModule {}
