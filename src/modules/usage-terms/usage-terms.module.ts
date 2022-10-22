import { Module } from '@nestjs/common';
import { UsageTermsService } from './usage-terms.service';
import { UsageTermsController } from './usage-terms.controller';

@Module({
  controllers: [UsageTermsController],
  providers: [UsageTermsService],
})
export class UsageTermsModule {}
