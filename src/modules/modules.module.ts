import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [AuthModule, RequestsModule],
  providers: [],
  exports: [],
})
export class ModulesModule {}
