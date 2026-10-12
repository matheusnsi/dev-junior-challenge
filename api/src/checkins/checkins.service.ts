import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CadastroService } from '../cadastro/cadastro.service';
import { Checkin } from './interfaces/checkin.interface';

@Injectable()
export class CheckinsService {
  private readonly fila: Checkin[] = [];

  constructor(private readonly cadastroService: CadastroService) {}

  listar(): Checkin[] {
    return this.fila;
  }

  async criar(cpf: string): Promise<Checkin> {
    const cpfLimpo = cpf.replace(/\D/g, '');
    const paciente = await this.cadastroService.buscarPorCpf(cpfLimpo);
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    const checkin: Checkin = {
      id: randomUUID(),
      cpf: paciente.cpf,
      nome: paciente.nome,
      chegadaEm: new Date(),
    };
    this.fila.push(checkin);
    return checkin;
  }
}
