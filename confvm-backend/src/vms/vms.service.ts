// src/vms/vms.service.ts

import { Injectable } from '@nestjs/common';
import { CreateVmDto } from './dto/create-vm.dto';
import * as sql from 'mssql';
import { v4 as uuidv4 } from 'uuid'; // for generating UUIDs
// Import other necessary modules and services

@Injectable()
export class VmsService {
  // Constructor and other methods...
  private readonly dbConfig = {
    user: 'confvm-db@confvm-db',
    password: 'fvm-Db!123', // Replace with your actual password
    server: 'confvm-db.database.windows.net',
    database: 'confvm-db',
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
    port: 1433
  };

  async addVm(createVmDto: CreateVmDto): Promise<any> {
    // Logic to add VM to the database
    // Return the newly created VM or relevant response
    const id = uuidv4(); // Generate a unique ID
    try {
        console.log(createVmDto);
      await sql.connect(this.dbConfig);
      await sql.query`
        INSERT INTO vms (
          id, resourceGroup, vmName, region, vmSize, osImageName, osImageId, 
          securityType, adminUsername, adminPasswordOrKey, authenticationType, status, createdAt
        ) VALUES (
          ${id}, ${createVmDto.resourceGroup}, ${createVmDto.vmName}, 
          ${createVmDto.region}, ${createVmDto.vmSize}, ${createVmDto.osImageName}, 
          ${createVmDto.osImageId}, ${createVmDto.securityType}, ${createVmDto.adminUsername}, 
          ${createVmDto.adminPasswordOrKey}, ${createVmDto.authenticationType}, 
          ${createVmDto.status}, ${new Date()}
        )`;    
        return id;
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    } finally {
      await sql.close();
    }
  }

  async listAllVms(resourceGroup: string): Promise<any[]> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query`SELECT * FROM vms WHERE resourceGroup = ${resourceGroup}`;
      return result.recordset; // Assuming you're using a library like mssql
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    } finally {
      await sql.close();
    }
  }

  async getSingleVm(id: string): Promise<any> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query`SELECT * FROM vms WHERE id = ${id}`;
      return result.recordset[0]; // Return the first (and should be only) record
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    } finally {
      await sql.close();
    }
  }
}
