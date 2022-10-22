import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles, enumRoles } from '@src/utils/decorators/roles.decorator';
import { CreateUsageTermDto } from './dto/create-usage-term.dto';
import { UsageTermsService } from './usage-terms.service';

@Controller({ path: 'usage-terms', version: '1' })
export class UsageTermsController {
  constructor(private readonly usageTermsService: UsageTermsService) {}

  @Post()
  @Roles(enumRoles.admin)
  async create(@Body() createUsageTermDto: CreateUsageTermDto) {
    const result = await this.usageTermsService.create(createUsageTermDto);

    return { id: result.id, version: result.version };
  }

  @Get()
  async find() {
    return this.usageTermsService.find();
  }
}
