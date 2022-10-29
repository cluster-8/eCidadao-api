import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RequestsModule } from './requests/requests.module';
import { UserModule } from './user/user.module';
import { UsageTermsModule } from './usage-terms/usage-terms.module';

@Module({
  imports: [AuthModule, RequestsModule, UserModule, UsageTermsModule],
  providers: [],
  exports: [],
})
export class ModulesModule {}
