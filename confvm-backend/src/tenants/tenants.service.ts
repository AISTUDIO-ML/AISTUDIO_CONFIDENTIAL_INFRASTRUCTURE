// src/tenants/tenants.service.ts

import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { v4 as uuidv4 } from 'uuid'; // for generating UUIDs
import { createResourceGroup, createNetworkSecurityGroupWithRules, deleteResourceGroup,
    listAllResourcesForThisResouceGroup } from './create-resourcegroups';

@Injectable()
export class TenantsService {
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

  async addTenant(tenantName: string, resourceGroup: string, region: string): Promise<string> {
    const id = uuidv4(); // Generate a unique ID
    try {
      let res = await createResourceGroup(tenantName, resourceGroup, region);
      console.log(res);
      let nsgs = await createNetworkSecurityGroupWithRules(resourceGroup, region);
      console.log(nsgs);
      await sql.connect(this.dbConfig);
      await sql.query`INSERT INTO tenants (id, tenantName, resourceGroup, region, createdAt) VALUES (${id}, ${tenantName}, ${resourceGroup}, ${region}, ${new Date()})`;
      return id;
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    } finally {
      await sql.close();
    }
  }

  async deleteTenant(id: string): Promise<string> {
    try {
      let res = await deleteResourceGroup(id);
      console.log('Delete result of resource group: ', res);
      await sql.connect(this.dbConfig);
      await sql.query`DELETE FROM tenants WHERE resourceGroup = ${id}`;
      return id;
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    } finally {
      await sql.close();
    }
  }

  async listTenants(): Promise<any[]> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query`SELECT * FROM tenants`;
      return result.recordset;
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    } finally {
      await sql.close();
    }
  }

  async listAllResources(resourceGroup: string): Promise<any> {
    try {
        let res = await listAllResourcesForThisResouceGroup(resourceGroup);
        return res;
      } catch (err) {
        console.error('List Resources error', err);
        throw err;
      } 
  }
}
