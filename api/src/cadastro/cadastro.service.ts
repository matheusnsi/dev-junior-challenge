import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paciente } from './interfaces/paciente.interface';

@Injectable()
export class CadastroService {
    private readonly baseUrl: string;

    constructor(configService: ConfigService) {
        this.baseUrl = configService.getOrThrow<string>('CADASTRO_URL');
    }

    async buscarPorCpf(cpf: string): Promise<Paciente | null> {
        const resposta = await fetch(`${this.baseUrl}/pacientes/${cpf}`);
        if (resposta.status === 404) {
            return null;
        }
        return (await resposta.json()) as Paciente;
    }
}
