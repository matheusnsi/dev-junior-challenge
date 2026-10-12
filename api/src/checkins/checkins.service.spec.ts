import { NotFoundException } from '@nestjs/common';
import { CadastroService } from '../cadastro/cadastro.service';
import { DatabaseService } from '../database/database.service';
import { CheckinsService } from './checkins.service';

describe('CheckinsService', () => {
  let service: CheckinsService;
  let cadastroService: { buscarPorCpf: jest.Mock };
  let database: { query: jest.Mock };

  beforeEach(() => {
    cadastroService = { buscarPorCpf: jest.fn() };
    database = { query: jest.fn() };
    service = new CheckinsService(
      cadastroService as unknown as CadastroService,
      database as unknown as DatabaseService,
    );
  });

  it('registra o check-in quando o paciente existe', async () => {
    cadastroService.buscarPorCpf.mockResolvedValue({
      cpf: '11111111111',
      nome: 'Ana Souza',
      dataNascimento: '1988-03-12',
    });
    database.query.mockResolvedValue([
      {
        id: 'id-teste',
        cpf: '11111111111',
        nome: 'Ana Souza',
        chegadaEm: new Date(),
      },
    ]);

    const checkin = await service.criar('111.111.111-11');

    expect(cadastroService.buscarPorCpf).toHaveBeenCalledWith('11111111111');
    expect(database.query).toHaveBeenCalledTimes(1);
    expect(checkin.nome).toBe('Ana Souza');
  });

  it('lança NotFoundException e não grava quando o cpf não existe', async () => {
    cadastroService.buscarPorCpf.mockResolvedValue(null);

    await expect(service.criar('99999999999')).rejects.toThrow(
      NotFoundException,
    );
    expect(database.query).not.toHaveBeenCalled();
  });
});