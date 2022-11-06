import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { ModulesModule } from './modules/modules.module';
import { EnsureAuthenticated } from './providers/middleware/ensure.authenticated.middleware';
import { ProvidersModule } from './providers/providers.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      isGlobal: true,
    }),
    UtilsModule,
    ModulesModule,
    ProvidersModule,
  ],
  providers: [ConfigService, AppService],
  exports: [ConfigService],
})
export class AppModule {
  ensureAuthenticatedExclude = [
    { path: '/v1/auth/sign-in', method: RequestMethod.POST },
    { path: '/v1/usage-terms', method: RequestMethod.GET },
    { path: '/v1/user', method: RequestMethod.POST },
  ];

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticated)
      .exclude(...this.ensureAuthenticatedExclude)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
