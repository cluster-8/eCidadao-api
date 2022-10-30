import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { NoCache } from '@src/utils/decorators/no.cache.decorator';
import { Roles, enumRoles } from '@src/utils/decorators/roles.decorator';
import { paramId } from '@src/utils/dtos/param.id.dto';
import { AddressDto } from './dto/address.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { FinishRequestDto, UpdateRequestDto } from './dto/update-request.dto';
import { RequestsService } from './requests.service';

@Controller({ path: 'requests', version: '1' })
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto) {
    const result = await this.requestsService.create(createRequestDto);

    return { id: result.id };
  }

  @Get('address')
  async findAddressFromGoogleGeocode(@Query() body: AddressDto) {
    return this.requestsService.findAddressFromGoogleGeocode(body.lat, body.long);
  }

  @Get('technical')
  @NoCache()
  @Roles(enumRoles.technical, enumRoles.admin)
  async findTechical() {
    return this.requestsService.findTechical();
  }

  @Get()
  @NoCache()
  async find() {
    return this.requestsService.find();
  }

  @Put('technical/:id')
  @Roles(enumRoles.technical, enumRoles.admin)
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
