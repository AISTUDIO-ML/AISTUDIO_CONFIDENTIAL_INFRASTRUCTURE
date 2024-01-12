// src/vms/vms.controller.ts

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { VmsService } from './vms.service';
import { CreateVmDto } from './dto/create-vm.dto';

@Controller('vms')
export class VmsController {
  constructor(private readonly vmsService: VmsService) {}

  @Post()
  async addVm(@Body() createVmDto: CreateVmDto) {
    return this.vmsService.addVm(createVmDto);
  }

  @Get('/listAll/:resourceGroup')
  async listAllVms(@Param('resourceGroup') resourceGroup: string) {
    return this.vmsService.listAllVms(resourceGroup);
  }

  @Get('/:id')
  async getSingleVm(@Param('id') id: string) {
    return this.vmsService.getSingleVm(id);
  }
}
