import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { FinishRequestDto, UpdateRequestDto } from './dto/update-request.dto';
import { paramId } from '@src/utils/dtos/param.id.dto';
import { Roles, enumRoles } from '@src/utils/decorators/roles.decorator';

@Controller({ path: 'requests', version: '1' })
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto) {
    const result = await this.requestsService.create(createRequestDto);

    return { id: result.id };
  }

  @Get('technical')
  @Roles(enumRoles.technical)
  async findTechical() {
    return this.requestsService.findTechical();
  }

  @Get()
  async find() {
    return this.requestsService.find();
  }

  @Put('technical/:id')
  @Roles(enumRoles.technical)
  async finishRequest(@Param() param: paramId, @Body() finishDto: FinishRequestDto) {
    return this.requestsService.finishRequest(param.id, finishDto);
  }

  @Put(':id')
  async update(@Param() param: paramId, @Body() updateDto: UpdateRequestDto) {
    return this.requestsService.update(param.id, updateDto);
  }

  @Delete(':id')
  async remove(@Param() param: paramId) {
    return this.requestsService.remove(param.id);
  }
}
