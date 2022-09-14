import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModulesModule } from './modules/modules.module';
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
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppModule {
  ensureAuthenticatedExclude = [
    { path: '/v1/auth/sign-in', method: RequestMethod.POST },
    { path: '/v1/user', method: RequestMethod.POST },
  ];

  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(EnsureAuthenticated)
  //     .exclude(...this.ensureAuthenticatedExclude)
  //     .forRoutes({
  //       path: '*',
  //       method: RequestMethod.ALL,
  //     });
  // }
}
