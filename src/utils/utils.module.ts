import { Global, Module } from '@nestjs/common';
import { GuardsModule } from './guards/guards.module';
import { Encrypter } from './services/encrypter.service';
import { Request } from './services/request.service';

@Global()
@Module({
  imports: [GuardsModule],
  providers: [Request, Encrypter],
  exports: [Request, Encrypter],
})
export class UtilsModule {}
