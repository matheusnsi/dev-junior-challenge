import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CadastroService } from '../cadastro/cadastro.service';
import { DatabaseService } from '../database/database.service';
import { Checkin } from './interfaces/checkin.interface';

@Injectable()
export class CheckinsService {
  constructor(
    private readonly cadastroService: CadastroService,
    private readonly database: DatabaseService,
  ) {}

  listar(): Promise<Checkin[]> {
    return this.database.query<Checkin>(`
      SELECT id, cpf, nome, chegada_em AS "chegadaEm"
      FROM checkins
      WHERE (chegada_em AT TIME ZONE 'America/Sao_Paulo')::date
          = (now() AT TIME ZONE 'America/Sao_Paulo')::date
      ORDER BY chegada_em
    `);
  }

  async criar(cpf: string): Promise<Checkin> {
    const cpfLimpo = cpf.replace(/\D/g, '');
    const paciente = await this.cadastroService.buscarPorCpf(cpfLimpo);

    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    const [checkin] = await this.database.query<Checkin>(
      `INSERT INTO checkins (id, cpf, nome, chegada_em)
       VALUES ($1, $2, $3, $4)
       RETURNING id, cpf, nome, chegada_em AS "chegadaEm"`,
      [randomUUID(), paciente.cpf, paciente.nome, new Date()],
    );

    return checkin;
  }
}