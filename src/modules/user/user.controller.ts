import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { paramId } from '@src/utils/dtos/param.id.dto';
import { Roles, enumRoles } from '@src/utils/decorators/roles.decorator';
import { NoCache } from '@src/utils/decorators/no.cache.decorator';
import { UpdateUserUsageTermsDto } from './dto/update-user-usage-terms.dto';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);

    return { id: result.user.id, token: result.token };
  }

  @Get(':id')
  @NoCache()
  @Roles(enumRoles.isSameUser, enumRoles.admin)
  findOne(@Param() param: paramId) {
    return this.userService.findOne(param.id);
  }

  @Put('usage-terms')
  updateUsageTerms(@Body() updateDto: UpdateUserUsageTermsDto) {
    return this.userService.updateUsageTerms(updateDto);
  }

  @Put(':id')
  @Roles(enumRoles.isSameUser, enumRoles.admin)
  update(@Param() param: paramId, @Body() updateDto: UpdateUserDto) {
    return this.userService.update(param.id, updateDto);
  }

  @Delete(':id')
  @Roles(enumRoles.isSameUser, enumRoles.admin)
  remove(@Param() param: paramId) {
    return this.userService.remove(param.id);
  }
}
