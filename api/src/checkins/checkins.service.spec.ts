import { NotFoundException } from '@nestjs/common';
import { CadastroService } from '../cadastro/cadastro.service';
import { CheckinsService } from './checkins.service';

describe('CheckinsService', () => {
  let service: CheckinsService;
  let cadastroService: { buscarPorCpf: jest.Mock };

  beforeEach(() => {
    cadastroService = { buscarPorCpf: jest.fn() };
    service = new CheckinsService(
      cadastroService as unknown as CadastroService,
    );
  });

  it('registra o check-in na fila quando o paciente existe', async () => {
    cadastroService.buscarPorCpf.mockResolvedValue({
      cpf: '11111111111',
      nome: 'Ana Souza',
      dataNascimento: '1988-03-12',
    });

    const checkin = await service.criar('111.111.111-11');

    expect(cadastroService.buscarPorCpf).toHaveBeenCalledWith('11111111111');
    expect(checkin.nome).toBe('Ana Souza');
    expect(service.listar()).toHaveLength(1);
  });

  it('lança NotFoundException quando o cpf não existe no cadastro', async () => {
    cadastroService.buscarPorCpf.mockResolvedValue(null);

    await expect(service.criar('99999999999')).rejects.toThrow(
      NotFoundException,
    );
    expect(service.listar()).toHaveLength(0);
  });
});
