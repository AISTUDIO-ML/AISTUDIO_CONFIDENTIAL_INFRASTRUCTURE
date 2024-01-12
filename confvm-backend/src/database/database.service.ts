// src/database/database.service.ts

import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';

@Injectable()
export class DatabaseService {

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
  async getUsers() {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query`SELECT * FROM users`;
      return result.recordset;
    } catch (err) {
      console.error('SQL error', err);
      throw err;
    } finally {
      await sql.close();
    }
  }
}
