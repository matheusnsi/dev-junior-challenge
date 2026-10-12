import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paciente } from './interfaces/paciente.interface';

@Injectable()
export class CadastroService {
  private readonly baseUrl: string;

  constructor(configService: ConfigService) {
    this.baseUrl = configService.getOrThrow<string>('CADASTRO_URL');
  }

  async buscarPorCpf(cpf: string): Promise<Paciente | null> {
    let resposta: Response;

    try {
      resposta = await fetch(`${this.baseUrl}/pacientes/${cpf}`, {
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      throw new BadGatewayException('Serviço de cadastro indisponível.');
    }

    if (resposta.status === 404) {
      return null;
    }

    if (!resposta.ok) {
      throw new BadGatewayException('Serviço de cadastro indisponível.');
    }

    return (await resposta.json()) as Paciente;
  }
}
