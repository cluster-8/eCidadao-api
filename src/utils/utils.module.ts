import { Global, Module } from '@nestjs/common';
import { GuardsModule } from './guards/guards.module';
import { Request } from './services/request.service';

@Global()
@Module({
  imports: [GuardsModule],
  providers: [Request],
  exports: [Request],
})
export class UtilsModule {}
