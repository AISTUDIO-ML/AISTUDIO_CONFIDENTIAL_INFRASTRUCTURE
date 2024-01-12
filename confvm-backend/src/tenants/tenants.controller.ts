// src/tenants/tenants.controller.ts

import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Post()
  async addTenant(@Body() body: any) {
    return await this.tenantsService.addTenant(body.tenantName, body.resourceGroup, body.region);
  }

  @Delete(':id')
  async deleteTenant(@Param('id') id: string) {
    return await this.tenantsService.deleteTenant(id);
  }

  @Get()
  async listTenants() {
    return await this.tenantsService.listTenants();
  }

  @Get('/listAllResources/:resourceGroup')
  async listAllResources(@Param('resourceGroup') resourceGroup: string) {
    return this.tenantsService.listAllResources(resourceGroup);
  }
}
