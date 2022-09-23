import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RequestsModule } from './requests/requests.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, RequestsModule, UserModule],
  providers: [],
  exports: [],
})
export class ModulesModule {}
