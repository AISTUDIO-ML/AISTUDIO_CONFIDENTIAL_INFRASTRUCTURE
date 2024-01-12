import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { UsersController } from './users/users.controller';
import { TenantsService } from './tenants/tenants.service';
import { TenantsController } from './tenants/tenants.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersController, TenantsController],
  providers: [AppService, DatabaseService, TenantsService],
})
export class AppModule {}
