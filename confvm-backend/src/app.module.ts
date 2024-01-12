import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { UsersController } from './users/users.controller';
import { TenantsService } from './tenants/tenants.service';
import { TenantsController } from './tenants/tenants.controller';
import { VmsController } from './vms/vms.controller';
import { VmsService } from './vms/vms.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController, TenantsController, VmsController],
  providers: [AppService, DatabaseService, TenantsService, VmsService],
})
export class AppModule {}
