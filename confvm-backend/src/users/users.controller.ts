// src/users/users.controller.ts

import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('users')
export class UsersController {
  constructor(private databaseService: DatabaseService) {}

  @Get()
  async findAll() {
    return this.databaseService.getUsers();
  }
}
