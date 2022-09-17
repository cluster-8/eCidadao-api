import { Controller, Get } from '@nestjs/common';
import { Roles, enumRoles } from '@src/utils/decorators/roles.decorator';
import { Ok } from '@src/utils/functions/exceptions.fn';
import { CacheService } from './cache.service';

@Controller({ path: 'admin/cache', version: '1' })
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('reset')
  @Roles(enumRoles.admin)
  async getMainData() {
    await this.cacheService.reset();

    Ok();
  }
}
