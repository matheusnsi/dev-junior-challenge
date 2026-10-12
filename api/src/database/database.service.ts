import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;

  constructor(configService: ConfigService) {
    this.pool = new Pool({
      connectionString: configService.getOrThrow<string>('DATABASE_URL'),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS checkins (
        id UUID PRIMARY KEY,
        cpf CHAR(11) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        chegada_em TIMESTAMPTZ NOT NULL
      )
    `);
  }

  async query<T extends QueryResultRow>(
    sql: string,
    valores: unknown[] = [],
  ): Promise<T[]> {
    const resultado = await this.pool.query<T>(sql, valores);
    return resultado.rows;
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}