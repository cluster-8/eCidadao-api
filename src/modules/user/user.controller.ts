import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { paramId } from '@src/utils/dtos/param.id.dto';
import { Roles, enumRoles } from '@src/utils/decorators/roles.decorator';
import { NoCache } from '@src/utils/decorators/no.cache.decorator';

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

  @Put(':id')
  @Roles(enumRoles.isSameUser)
  update(@Param() param: paramId, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(param.id, updateUserDto);
  }

  @Delete(':id')
  @Roles(enumRoles.isSameUser)
  remove(@Param() param: paramId) {
    return this.userService.remove(param.id);
  }
}
